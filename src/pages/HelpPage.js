import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

export default function HelpPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [message, setMessage] = useState("");

  const recognitionRef = useRef(null);

  // Voice Recognition Function
  const startVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) return; // Prevent multiple instances

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Recognized speech:", transcript);
      if (transcript.includes("help")) {
        alert("Help detected! Triggering emergency call.");
        handleHelpClick();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        console.warn("No speech detected, restarting...");
        setTimeout(() => recognition.start(), 1000);
      } else {
        alert("Speech recognition error occurred. Please try again.");
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    startVoiceRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [startVoiceRecognition]);

  // Function to Handle Help Button Click
  const handleHelpClick = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocationUrl(googleMapsUrl);

        const emergencyMessage = `🚨 EMERGENCY! I need help. My location: ${googleMapsUrl}`;
        setMessage(emergencyMessage);

        alert("Location fetched! Enter details and send the emergency message.");
        startRecording();

        if (phoneNumber) {
          setTimeout(() => {
            window.location.href = `tel:${phoneNumber}`;
          }, 1000); // Small delay to ensure location updates before calling
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Could not fetch location. Please enable GPS.");
      }
    );
  }, [phoneNumber]);

  // Function to Start Audio Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      alert("Microphone access granted! Recording started.");
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Could not access microphone. Please allow microphone access.");
    }
  };

  // Function to Send SMS
  const sendSMS = () => {
    if (!phoneNumber) {
      alert("Please enter a valid phone number.");
      return;
    }
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  // Function to Send Email
  const sendEmail = () => {
    if (!email) {
      alert("Please enter a valid email.");
      return;
    }
    window.location.href = `mailto:${email}?subject=Emergency%20Help&body=${encodeURIComponent(message)}`;
  };

  // Function to Copy Emergency Message
  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(message);
    alert("Message copied! Paste it into your SMS app.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-red-600 text-white flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <button className="text-xl font-bold">&#9776;</button>
          <h1 className="font-bold text-xl">SHEcurity</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Wi-Fi <span className="font-bold">ON</span></span>
          <span className="text-sm">GPS <span className="font-bold">ON</span></span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow bg-white">
        {/* Help Button */}
        <button
          onClick={handleHelpClick}
          className="bg-red-600 text-white text-2xl font-bold rounded-full w-40 h-40 flex items-center justify-center shadow-lg mb-8"
        >
          HELP
        </button>

        {/* Start Voice Recognition Button */}
        <button
          onClick={startVoiceRecognition}
          className="bg-blue-600 text-white p-2 rounded-lg mb-4"
        >
          Start Voice Recognition
        </button>

        {/* Input Fields */}
        <div className="w-80 flex flex-col items-center">
          <input
            type="tel"
            placeholder="Enter emergency phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full mb-2"
          />
          <input
            type="email"
            placeholder="Enter emergency email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full mb-4"
          />
        </div>

        {/* Action Buttons */}
        {locationUrl && (
          <div className="flex flex-col items-center mt-4">
            <button className="bg-green-600 text-white p-2 rounded-lg mb-2 w-64 text-center" onClick={sendSMS}>
              Send SMS
            </button>
            <button className="bg-blue-600 text-white p-2 rounded-lg mb-2 w-64 text-center" onClick={sendEmail}>
              Send Email
            </button>
            <button className="bg-gray-600 text-white p-2 rounded-lg mb-2 w-64 text-center" onClick={copyMessageToClipboard}>
              Copy Message
            </button>
            <a className="bg-red-500 text-white p-2 rounded-lg w-64 text-center" href={`tel:${phoneNumber}`}>
              Call Now
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="flex justify-center items-center p-2 bg-gray-100">
        <Link to="/login" className="mx-4 text-blue-600">Login</Link>
        <Link to="/signup" className="mx-4 text-blue-600">Signup</Link>
      </footer>
    </div>
  );
}
