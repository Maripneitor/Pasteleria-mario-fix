import { useState } from 'react';
import { Image as ImageIcon, Sparkles, Loader2, Upload } from 'lucide-react';

const ImageAnalyzer = ({ onAnalysisComplete }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Simulate Analysis
        setIsAnalyzing(true);
        setAnalysisResult('');

        // Mock Delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // TODO: Replace with actual Computer Vision API call
        // const response = await api.post('/analyze-image', formData);
        // setAnalysisResult(response.data.analysis);
        const mockAnalysis = "Diseño complejo detectado. \nTécnicas: Fondant moldeado, efecto acuarela.\nDificultad estimada: Alta.\nRecomendación: Cobrar extra por modelado 3D.";

        setAnalysisResult(mockAnalysis);
        onAnalysisComplete(mockAnalysis);
        setIsAnalyzing(false);
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors relative group">

            {!imagePreview ? (
                <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="text-blue-500" size={24} />
                    </div>
                    <span className="text-gray-600 font-medium">Subir imagen de referencia</span>
                    <span className="text-xs text-gray-400 mt-1">Soporta JPG, PNG</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
            ) : (
                <div className="relative">
                    <img src={imagePreview} alt="Reference" className="w-full h-48 object-cover rounded-lg" />
                    <button
                        onClick={() => { setImagePreview(null); setAnalysisResult(''); }}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                    >
                        <Upload size={14} className="rotate-45" /> {/* Close icon visual hack */}
                    </button>

                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center text-white">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <span className="text-sm font-medium animate-pulse">Analizando con Vision AI...</span>
                        </div>
                    )}
                </div>
            )}

            {analysisResult && (
                <div className="mt-4 bg-purple-50 border border-purple-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-1">
                        <Sparkles size={14} /> Análisis IA
                    </div>
                    <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                        {analysisResult}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ImageAnalyzer;
