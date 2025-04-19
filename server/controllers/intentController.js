const { spawn } = require('child_process');

// Function to predict intent using Python BERT model
const predictIntent = (text) => {
  return new Promise((resolve, reject) => {
    // Run Python script as a child process
    const python = spawn('python', ['predict_intent.py', text]);
    
    let result = '';
    
    // Collect data from script
    python.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    // Handle errors
    python.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
    
    // When the script exits
    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python process exited with code ${code}`));
      }
      
      try {
        // Parse the JSON result
        const prediction = JSON.parse(result);
        resolve(prediction);
      } catch (error) {
        reject(new Error('Failed to parse prediction result'));
      }
    });
  });
};

// Controller for intent prediction
exports.predictUserIntent = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const prediction = await predictIntent(text);
    
    res.json({
      intent: prediction.intent,
      confidence: prediction.confidence
    });
  } catch (error) {
    console.error('Intent prediction error:', error);
    res.status(500).json({ error: 'Failed to predict intent' });
  }
};
