import React, { useState, useRef, useEffect } from "react";

export default function CommunicationPracticeGemini() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interviewType, setInterviewType] = useState("HR");

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  // ✅ Initialize speech recognition only once
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recog = new window.webkitSpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "en-US";

      recognitionRef.current = recog;
    }
  }, []);

  const startListening = () => {
    const recog = recognitionRef.current;
    if (!recog) return alert("Speech recognition not supported in your browser");

    finalTranscriptRef.current = "";
    setIsListening(true);
    recog.start();

    recog.onresult = (event) => {
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      // ✅ Live update textarea
      setAnswer(finalTranscriptRef.current + interim);
    };

    // ✅ Restart automatically if Chrome stops it
    recog.onend = () => {
      if (isListening) recog.start();
    };

    recog.onerror = () => {
      if (isListening) recog.start();
    };
  };

  const stopListening = () => {
    const recog = recognitionRef.current;
    setIsListening(false);
    recog?.stop();
  };

  // ✅ Get interview question
  const fetchQuestion = async () => {
    const prompt = `Give one ${interviewType} interview question in English.
    Ask unique questions every time, fresher friendly. Only output the question.`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=Your_Key",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    setQuestion(data.candidates?.[0]?.content?.parts?.[0]?.text || "No question generated.");
    setFeedback("");
  };

  // ✅ Get feedback
  const getFeedback = async () => {
    if (!answer) return alert("Speak or type your answer first");

    const prompt = `
      Evaluate this job interview answer for clarity, fluency, grammar.
      Give feedback within 100 words, add a new blank line and give score out of 10.
      Also don't keep the text plain with no bold or italics
      Question: ${question}
      Answer: ${answer}
    `;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=Your_key",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    setFeedback(data.candidates?.[0]?.content?.parts?.[0]?.text || "No feedback received.");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600">
        🗣️ Communication Practice (Gemini)
      </h1>
      <p lassName="text-2xl font-bold mb-4 text-indigo-600">
        Use Chrome Browser on desktop / android and have a proper microphone setup. <br />
        Speak Slowly and Clearly, without taking pause. 
      </p>

      <select
        value={interviewType}
        onChange={(e) => setInterviewType(e.target.value)}
        className="p-2 border rounded mb-4"
      >
        <option value="HR">HR Interview</option>
        <option value="Technical">Technical Interview</option>
        <option value="Behavioral">Behavioral Interview</option>
      </select>

      <button
        onClick={fetchQuestion}
        className="px-4 py-2 bg-indigo-600 text-white rounded mb-4"
      >
        🎯 Generate Question
      </button>

      {question && (
        <div className="bg-white shadow p-4 rounded w-full max-w-md mb-4">
          <p className="font-semibold">Question:</p>
          <p>{question}</p>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={startListening}
          disabled={isListening}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          🎙️ Speak
        </button>
        <button
          onClick={stopListening}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          ⏹️ Stop
        </button>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full max-w-md p-2 border rounded mb-4"
        rows={3}
        placeholder="Your answer appears here or type..."
      />

      <button
        onClick={getFeedback}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        🧠 Get Feedback
      </button>

      {feedback && (
        <div className="bg-white shadow p-4 rounded w-full max-w-md">
          <p className="font-semibold text-green-700">Feedback:</p>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
