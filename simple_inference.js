// Import the necessary classes from the Transformers.js library
// --- Updated to a newer stable version ---
import { AutoTokenizer, AutoModelForSequenceClassification } 
  from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';


function softmax(arr) {
    const maxLogit = Math.max(...arr); // numerical stability
    const exps = arr.map(x => Math.exp(x - maxLogit));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sumExps);
}



/**
 * This is the main function that loads the model and runs inference.
 */
async function runClassification() {
    try {
        // The path to your local directory containing model.onnx and all config files.
        const MODEL_PATH = 'models';

        // This maps the raw output labels to human-readable sentiments.
        const LABEL_MAP = {
            'LABEL_0': 'Negative',
            'LABEL_1': 'Neutral',
            'LABEL_2': 'Positive'
        };

        // --- Load tokenizer and model separately for manual control ---

        // 1. Load the tokenizer
        console.log(`Loading tokenizer from: ${MODEL_PATH}`);
        const tokenizer = await AutoTokenizer.from_pretrained(MODEL_PATH);
        console.log('Tokenizer loaded successfully!');

        // 2. Load the model
        console.log(`Loading model from: ${MODEL_PATH}`);
        const model = await AutoModelForSequenceClassification.from_pretrained(MODEL_PATH, {
            quantized: false
        });
        console.log('Model loaded successfully!');

        // 3. Define the text to classify
        const textToPredict = "Rockstar....Best album till now.. I can't explain my feelings while listening to this song";
        console.log(`\nInput Text: "${textToPredict}"`);

        // 4. Manually tokenize the text
        console.log('Tokenizing text...');
        const inputs = tokenizer(textToPredict, {
            padding: 'max_length',
            truncation: true,
            max_length: 128, // ✅ fixed snake_case
        });

        // 5. Run prediction with correctly formatted inputs
        console.log('Running prediction...');
        const outputs = await model({ ...inputs }); // ✅ spread inputs
        const logits = outputs.logits;

            // 6. Process the output to get the final prediction
        console.log('\n--- Prediction Result ---');

        // Convert logits tensor to raw JS array
        const logitsArray = logits.data;

        // Get the best prediction index
        const predictionId = logitsArray.indexOf(Math.max(...logitsArray));
        const bestPredictionLabel = `LABEL_${predictionId}`;

        // Get human-readable label
        const sentiment = LABEL_MAP[bestPredictionLabel] || 'Unknown';

        // Apply softmax manually
        const confidenceScores = softmax(logitsArray);
        const confidence = (confidenceScores[predictionId] * 100).toFixed(2);

        console.log(`Predicted Sentiment: ${sentiment}`);
        console.log(`Confidence: ${confidence}%`);
        console.log('\nRaw model logits:', logitsArray);

    } catch (error) {
        // Log any errors that occur during the process
        console.error('An error occurred during inference:', error);
    }
}

// Start the process
runClassification();
