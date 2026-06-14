use keyring::{Entry, Error as KeyringError};
use serde::Deserialize;
use serde_json::{json, Value};

const API_KEY_SERVICE: &str = "facescore";
const API_KEY_ACCOUNT: &str = "anthropic_api_key";
const ANTHROPIC_MESSAGES_URL: &str = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION: &str = "2023-06-01";
const MODEL: &str = "claude-sonnet-4-6";

#[derive(Debug, Deserialize)]
struct ClaudeImagePayload {
    media_type: String,
    data: String,
}

#[derive(Debug, Deserialize)]
struct AnthropicErrorResponse {
    error: Option<AnthropicErrorBody>,
}

#[derive(Debug, Deserialize)]
struct AnthropicErrorBody {
    message: Option<String>,
}

fn api_key_entry() -> Result<Entry, String> {
    Entry::new(API_KEY_SERVICE, API_KEY_ACCOUNT)
        .map_err(|_| "Could not access the OS credential store.".to_string())
}

fn is_valid_api_key_format(key: &str) -> bool {
    let Some(rest) = key.strip_prefix("sk-ant-") else {
        return false;
    };

    (16..=128).contains(&rest.len())
        && rest
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-' || byte == b'_')
}

fn get_stored_api_key() -> Result<String, String> {
    match api_key_entry()?.get_password() {
        Ok(api_key) if !api_key.trim().is_empty() => Ok(api_key),
        Ok(_) | Err(KeyringError::NoEntry) => {
            Err("Anthropic API key is not configured.".to_string())
        }
        Err(_) => {
            Err("Could not read the Anthropic API key from the OS credential store.".to_string())
        }
    }
}

#[tauri::command]
fn has_api_key() -> bool {
    get_stored_api_key().is_ok()
}

#[tauri::command]
fn save_api_key(key: String) -> Result<(), String> {
    let trimmed = key.trim();

    if !is_valid_api_key_format(trimmed) {
        return Err("Invalid API key format".to_string());
    }

    api_key_entry()?
        .set_password(trimmed)
        .map_err(|_| "Could not save the Anthropic API key to the OS credential store.".to_string())
}

#[tauri::command]
fn clear_api_key() -> Result<(), String> {
    match api_key_entry()?.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(_) => {
            Err("Could not remove the Anthropic API key from the OS credential store.".to_string())
        }
    }
}

#[tauri::command]
async fn analyze_face(image: ClaudeImagePayload, prompt: String) -> Result<Value, String> {
    let api_key = get_stored_api_key()?;
    let client = reqwest::Client::new();
    let response = client
        .post(ANTHROPIC_MESSAGES_URL)
        .header("anthropic-version", ANTHROPIC_VERSION)
        .header("content-type", "application/json")
        .header("x-api-key", api_key.trim())
        .json(&build_anthropic_request(&image, &prompt))
        .send()
        .await
        .map_err(|_| "Network error. Please check your connection and try again.".to_string())?;

    let status = response.status();

    if !status.is_success() {
        let service_message = read_service_error_message(response).await;

        if status == reqwest::StatusCode::UNAUTHORIZED || status == reqwest::StatusCode::FORBIDDEN
        {
            return Err(match service_message {
                Some(message) => format!("Authentication failed: {message}"),
                None => "Authentication failed. Please check your Anthropic API key.".to_string(),
            });
        }

        if status == reqwest::StatusCode::TOO_MANY_REQUESTS {
            return Err(
                "Rate limit exceeded or insufficient quota. Please try again later.".to_string(),
            );
        }

        return Err(format!(
            "Analysis service rejected the request ({}). Please try again later.",
            status.as_u16()
        ));
    }

    response
        .json::<Value>()
        .await
        .map_err(|_| "Analysis service returned an invalid response format.".to_string())
}

async fn read_service_error_message(response: reqwest::Response) -> Option<String> {
    response
        .json::<AnthropicErrorResponse>()
        .await
        .ok()
        .and_then(|payload| payload.error)
        .and_then(|error| error.message)
        .filter(|message| !message.trim().is_empty())
}

fn build_anthropic_request(image: &ClaudeImagePayload, prompt: &str) -> Value {
    json!({
        "model": MODEL,
        "max_tokens": 4096,
        "tools": [
            {
                "name": "generate_report",
                "description": "Output the facial analysis report in a structured format.",
                "input_schema": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "overallScore": {
                            "type": "object",
                            "additionalProperties": false,
                            "properties": {
                                "value": { "type": "number" },
                                "label": { "type": "string" },
                                "summary": { "type": "string" }
                            },
                            "required": ["value", "label", "summary"]
                        },
                        "scoreCategories": {
                            "type": "array",
                            "minItems": 5,
                            "maxItems": 5,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "properties": {
                                    "id": { "type": "string", "enum": ["symmetry", "proportions", "skin", "grooming", "style"] },
                                    "label": { "type": "string" },
                                    "value": { "type": "number" },
                                    "summary": { "type": "string" },
                                    "details": { "type": "array", "items": { "type": "string" } }
                                },
                                "required": ["id", "label", "value", "summary", "details"]
                            }
                        },
                        "strengths": { "type": "array", "minItems": 1, "maxItems": 10, "items": { "type": "string" } },
                        "recommendations": {
                            "type": "array",
                            "minItems": 1,
                            "maxItems": 10,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "properties": {
                                    "title": { "type": "string" },
                                    "priority": { "type": "string", "enum": ["high", "medium", "low"] },
                                    "detail": { "type": "string" }
                                },
                                "required": ["title", "priority", "detail"]
                            }
                        },
                        "groomingNotes": { "type": "array", "minItems": 1, "maxItems": 10, "items": { "type": "string" } },
                        "styleNotes": { "type": "array", "minItems": 1, "maxItems": 10, "items": { "type": "string" } }
                    },
                    "required": ["overallScore", "scoreCategories", "strengths", "recommendations", "groomingNotes", "styleNotes"]
                }
            }
        ],
        "tool_choice": { "type": "tool", "name": "generate_report" },
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image.media_type,
                            "data": image.data
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    })
}

#[tauri::command]
fn validate_api_key_format(key: String) -> bool {
    is_valid_api_key_format(key.trim())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            analyze_face,
            clear_api_key,
            has_api_key,
            save_api_key,
            validate_api_key_format
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn validates_expected_anthropic_key_format() {
        assert!(is_valid_api_key_format("sk-ant-testkey-1234567890"));
        assert!(is_valid_api_key_format(
            "sk-ant-api03-abcdefghijklmnopqrstuvwxyz123456"
        ));
        assert!(!is_valid_api_key_format(""));
        assert!(!is_valid_api_key_format("sk-other-testkey-1234567890"));
        assert!(!is_valid_api_key_format("sk-ant-short"));
        assert!(!is_valid_api_key_format("sk-ant-invalid space value"));
    }

    #[test]
    fn builds_anthropic_payload_without_api_key() {
        let image = ClaudeImagePayload {
            media_type: "image/jpeg".to_string(),
            data: "ZmFjZQ==".to_string(),
        };

        let payload = build_anthropic_request(&image, "Analyze this image");
        let payload_text = serde_json::to_string(&payload).expect("payload should serialize");

        assert_eq!(payload["model"], MODEL);
        assert_eq!(payload["max_tokens"], 4096);
        assert_eq!(
            payload["messages"][0]["content"][0]["source"]["media_type"],
            "image/jpeg"
        );
        assert_eq!(payload["messages"][0]["content"][1]["text"], "Analyze this image");
        assert!(!payload_text.contains("sk-ant-"));
        assert!(!payload_text.contains("x-api-key"));
    }
}
