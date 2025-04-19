import sys
import json
import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertForSequenceClassification

def predict_intent(text):
    # Define the path where you saved the model
    model_path = './bert_intent_classifier'
    
    # Load the tokenizer and model
    tokenizer = BertTokenizer.from_pretrained(model_path)
    model = BertForSequenceClassification.from_pretrained(model_path)
    
    # Check for GPU availability
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    
    # Set the model to evaluation mode
    model.eval()
    
    # Define the intent labels
    intent_labels = [
        "complaint",
        "contact_human_agent",
        "cancel_order",
        "change_order",
        "get_refund",
        "check_refund_policy",
        "check_payment_methods",
        "payment_issue"
    ]
    
    # Tokenize the input text
    encoded_text = tokenizer.encode_plus(
        text,
        add_special_tokens=True,
        max_length=128,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt'
    )
    
    # Move the encoded inputs to the device
    input_ids = encoded_text['input_ids'].to(device)
    attention_mask = encoded_text['attention_mask'].to(device)
    
    # Make prediction without calculating gradients
    with torch.no_grad():
        outputs = model(input_ids, token_type_ids=None, attention_mask=attention_mask)
        
        # Get the predicted class
        logits = outputs.logits
        probabilities = F.softmax(logits, dim=1)  # Apply softmax to get probabilities
        predicted_class = torch.argmax(logits, dim=1).item()
        confidence = probabilities[0, predicted_class].item()  # Get confidence
    
    # Return the predicted intent and confidence
    return {
        "intent": intent_labels[predicted_class],
        "confidence": confidence
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No text provided"}))
        sys.exit(1)
    
    # Get the text from command line argument
    text = sys.argv[1]
    
    # Predict the intent
    result = predict_intent(text)
    
    # Print the result as JSON
    print(json.dumps(result))