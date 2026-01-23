import { useState, useRef, useEffect } from 'react';
import { Mic, Square, X, Loader2 } from 'lucide-react';

const VoiceDictationModal = ({ isOpen, onClose, onDictationComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [timer, setTimer] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            startRecording();
        } else {
            stopRecordingAndCleanup();
        }
        return () => stopRecordingAndCleanup();
    }, [isOpen]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                processAudio(blob);

                // Stop tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTimer(0);
            timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("No se pudo acceder al micrófono.");
            onClose();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const stopRecordingAndCleanup = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        setTimer(0);
    };

    const processAudio = async (audioBlob) => {
        setIsProcessing(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock AI Response - In production, send audioBlob to backend
        const mockAiResponse = {
            clientName: "Juan Pérez",
            persons: 50,
            cakeFlavor: ["Chocolate", "Vainilla"],
            filling: ["Fresa"],
            designDescription: "Pastel rectangular de dos pisos con decoración de Spiderman en rojo y azul.",
            shape: "Rectangular",
            folioType: "Base/Especial"
        };

        onDictationComplete(mockAiResponse);
        setIsProcessing(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center relative shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    {isProcessing ? 'Procesando Audio...' : 'Escuchando...'}
                </h3>

                <div className="relative h-32 flex items-center justify-center mb-6">
                    {isProcessing ? (
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    ) : (
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                            <div className="relative bg-red-500 p-6 rounded-full text-white shadow-lg">
                                <Mic size={40} />
                            </div>
                        </div>
                    )}

                    {/* Fake Waveform Visual */}
                    {isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none opacity-20">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-2 bg-gray-800 rounded-full animate-pulse" style={{ height: `${Math.random() * 40 + 20}px`, animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-3xl font-mono font-bold text-gray-700 mb-8">
                    {formatTime(timer)}
                </div>

                {!isProcessing && (
                    <button
                        onClick={stopRecording}
                        className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-all flex items-center justify-center gap-2 mx-auto active:scale-95"
                    >
                        <Square size={16} fill="currentColor" />
                        Detener y Procesar
                    </button>
                )}

                <p className="mt-4 text-sm text-gray-400">Habla claro mencionando el cliente, sabor y detalles.</p>
            </div>
        </div>
    );
};

export default VoiceDictationModal;
