import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Upload,
  Camera,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Sparkles,
  Info,
  ShieldCheck,
  Bug,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  predictDisease,
  getDiseaseTreatmentPlan,
} from "../services/cropRecommendationApi";
import FarmToolsTabs from "../components/FarmToolsTabs";

const DiseaseDetection = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ---------- Image source ----------
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // ---------- Prediction ----------
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [modelMeta, setModelMeta] = useState(null);

  // ---------- Treatment plan modal ----------
  const [planFor, setPlanFor] = useState(null); // the prediction object, or null
  const [planCache, setPlanCache] = useState({});
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  // Stop the camera stream on unmount so the browser's camera
  // indicator light doesn't stay on after leaving the page.
  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetResults = () => {
    setPredictions([]);
    setPredictError("");
    setModelMeta(null);
  };

  const setImage = (fileOrBlob) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(fileOrBlob);
    setPreviewUrl(URL.createObjectURL(fileOrBlob));
    resetResults();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const startCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Your browser doesn't support camera access. Please upload a photo instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      // Wait a tick for the <video> element to mount before attaching.
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch (err) {
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please upload a photo instead."
          : "Couldn't access the camera. Please upload a photo instead."
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          blob.name = "captured-leaf.jpg";
          setImage(blob);
        }
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setPredicting(true);
    setPredictError("");
    try {
      const data = await predictDisease(imageFile);
      setPredictions(data.predictions);
      setModelMeta({ model_name: data.model_name });
    } catch (err) {
      setPredictError(err.message);
    } finally {
      setPredicting(false);
    }
  };

  const handleGetPlan = async (prediction) => {
    setPlanFor(prediction);
    setPlanError("");
    if (planCache[prediction.class_key]) return;

    setPlanLoading(true);
    try {
      const plan = await getDiseaseTreatmentPlan(prediction.class_key);
      setPlanCache((prev) => ({ ...prev, [prediction.class_key]: plan }));
    } catch (err) {
      setPlanError(err.message);
    } finally {
      setPlanLoading(false);
    }
  };

  const closePlan = () => {
    setPlanFor(null);
    setPlanError("");
  };

  const topPrediction = predictions[0];
  const alternates = predictions.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-6 sticky top-16 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Bug className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Plant Disease Detection</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
        <FarmToolsTabs active="disease" />

        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Diagnose a Leaf in Seconds
          </h2>
          <p className="text-green-600">
            Upload a photo or use your camera — an AI model trained on 38 plant conditions
            identifies the disease and suggests a remedy.
          </p>
        </div>

        {/* ---------------- Image capture ---------------- */}
        <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-green-100">
          {!cameraActive && !previewUrl && (
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-green-300 rounded-lg p-8 cursor-pointer hover:bg-green-50 transition-colors">
                <Upload className="w-8 h-8 text-green-600" />
                <span className="text-sm font-medium text-green-700">Upload a Photo</span>
                <span className="text-xs text-green-500">JPG, PNG or WEBP</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={startCamera}
                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-green-300 rounded-lg p-8 hover:bg-green-50 transition-colors"
              >
                <Camera className="w-8 h-8 text-green-600" />
                <span className="text-sm font-medium text-green-700">Use Camera</span>
                <span className="text-xs text-green-500">Capture a leaf live</span>
              </button>
            </div>
          )}

          {cameraError && (
            <div className="mt-4 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {cameraActive && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full max-h-[400px] object-contain" />
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Camera className="w-4 h-4" /> Capture
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />

          {previewUrl && !cameraActive && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-green-200 max-w-sm mx-auto">
                <img src={previewUrl} alt="Leaf preview" className="w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl("");
                    resetResults();
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {predictError && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 max-w-sm mx-auto">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{predictError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={predicting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3.5 px-8 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {predicting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Analyze Leaf
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ---------------- Results ---------------- */}
        {topPrediction && (
          <div className="space-y-4">
            {/* Top prediction */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-green-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      topPrediction.is_healthy ? "bg-green-100" : "bg-amber-100"
                    }`}
                  >
                    {topPrediction.is_healthy ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">
                      {topPrediction.crop} — {topPrediction.condition}
                    </h3>
                    <p className="text-sm text-green-600">
                      {(topPrediction.confidence * 100).toFixed(1)}% confidence
                    </p>
                  </div>
                </div>
              </div>

              {topPrediction.is_healthy ? (
                <div className="flex items-start gap-2 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-4">
                  <ShieldCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    This leaf looks healthy — no disease detected. Continue normal care and keep
                    monitoring regularly.
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <InfoRow label="Appearance" value={topPrediction.info.appearance} />
                  <InfoRow label="Cause" value={topPrediction.info.cause} />
                  <InfoRow label="Recommended Solution" value={topPrediction.info.recommended_solution} />
                  <InfoRow label="Precautions" value={topPrediction.info.precautions} />

                  <button
                    type="button"
                    onClick={() => handleGetPlan(topPrediction)}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4" /> Get Detailed AI Treatment Plan
                  </button>
                </div>
              )}
            </div>

            {/* Alternates */}
            {alternates.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                <p className="text-xs font-semibold text-green-500 uppercase tracking-wide mb-3">
                  Other possible matches
                </p>
                <div className="space-y-2">
                  {alternates.map((p) => (
                    <div
                      key={p.class_key}
                      className="flex items-center justify-between text-sm bg-green-50/60 border border-green-100 rounded-lg px-4 py-2.5"
                    >
                      <span className="text-green-800">
                        {p.crop} — {p.condition}
                      </span>
                      <span className="text-green-500">{(p.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modelMeta && (
              <p className="text-xs text-green-400 text-center">{modelMeta.model_name}</p>
            )}
          </div>
        )}
      </div>

      {/* ---------------- Treatment Plan Modal ---------------- */}
      {planFor && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={closePlan}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-green-800 to-emerald-800 text-white p-5 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Leaf className="w-5 h-5" /> {planFor.crop} — {planFor.condition}
              </h3>
              <button onClick={closePlan} className="p-1.5 rounded-lg hover:bg-green-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {planLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-green-600">
                  <Loader2 className="w-8 h-8 animate-spin mb-3" />
                  <p className="text-sm">Asking AI for a detailed treatment plan…</p>
                </div>
              )}

              {!planLoading && planError && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{planError}</span>
                </div>
              )}

              {!planLoading &&
                !planError &&
                planCache[planFor.class_key] &&
                (() => {
                  const plan = planCache[planFor.class_key];
                  return (
                    <div className="space-y-6">
                      <p className="text-sm text-green-900 bg-green-50 border border-green-100 rounded-lg p-4">
                        {plan.overview}
                      </p>

                      <PlanSection title="Organic Treatment">
                        <TreatmentList items={plan.organic_treatment} />
                      </PlanSection>

                      <PlanSection title="Chemical Treatment">
                        <TreatmentList items={plan.chemical_treatment} />
                        <p className="text-xs text-green-500 mt-2 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          Always follow the product label for exact dosage — rates vary by
                          formulation and region.
                        </p>
                      </PlanSection>

                      <PlanSection title="Application Tips">
                        <BulletList items={plan.application_tips} />
                      </PlanSection>

                      <PlanSection title="Prevention Schedule">
                        <BulletList items={plan.prevention_schedule} />
                      </PlanSection>

                      <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{plan.when_to_seek_help}</span>
                      </div>
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm text-green-900">{value}</p>
  </div>
);

const PlanSection = ({ title, children }) => (
  <div>
    <h4 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2">{title}</h4>
    {children}
  </div>
);

const TreatmentList = ({ items }) => (
  <div className="space-y-2">
    {items.map((item, i) => (
      <div key={i} className="text-sm bg-green-50 border border-green-100 rounded-lg p-3">
        <span className="font-semibold text-green-800">{item.name}</span>
        <span className="text-green-700"> — {item.details}</span>
      </div>
    ))}
  </div>
);

const BulletList = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm text-green-900">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default DiseaseDetection;
