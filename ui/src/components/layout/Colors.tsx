import { useState } from "react";

const defaultColors = [
  { hex: "#03bafc", name: "תכלת" },
  { hex: "#42d4f5", name: "כחול בהיר" },
  { hex: "#17459b", name: "כחול" },
  { hex: "#fff100", name: "צהוב" },
  { hex: "#6b44d4", name: "כחול עמוק" },
  { hex: "#8e24aa", name: "סגול" },
  { hex: "#f44336", name: "אדום" },
  { hex: "#9e9e9e", name: "אפור" },
  { hex: "#607d8b", name: "אפור כהה" },
  { hex: "#4caf50", name: "ירוק" },
  { hex: "#009688", name: "טורקיז" },
  { hex: "#ff5722", name: "כתום כהה" },
];

const getSavedColors = () => {
  const saved = localStorage.getItem("customColors");
  return saved ? JSON.parse(saved) : [];
};

export const ColorPickerPalette = ({
  selectedColor,
  onSelect,
  selectedBackgroundColor,
  onBackgroundSelect,
}: {
  selectedColor: string;
  onSelect: (color: string) => void;
  selectedBackgroundColor?: string;
  onBackgroundSelect?: (color: string) => void;
}) => {
  const [customColors, setCustomColors] = useState(getSavedColors);
  const [showPicker, setShowPicker] = useState(false);
  const [tempColor, setTempColor] = useState("");
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const getBackgroundColorVariants = (selectedHex: string) => {
    if (!selectedHex || selectedHex === "#ffffff") return [];
    
    const [h, s, l] = hexToHsl(selectedHex);
    
    return [
      hslToHex(h, Math.max(s - 25, 15), Math.min(l + 25, 65)),
      hslToHex(h, Math.max(s - 45, 8), Math.min(l + 35, 75)),  
      hslToHex(h, Math.max(s - 55, 5), Math.min(l + 42, 85)),  
      "hsla(244, 10%, 67%, 0.69)" 
    ];
  };

  const handleColorChange = (h: number, s: number, l: number) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
    setTempColor(hslToHex(h, s, l));
  };

  const handleAddColor = () => {
    if (!customColors.includes(tempColor)) {
      const updated = [...customColors, tempColor];
      setCustomColors(updated);
      localStorage.setItem("customColors", JSON.stringify(updated));
    }
    setShowPicker(false);
    onSelect(tempColor);
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempColor("");
    setHue(0);
    setSaturation(100);
    setLightness(50);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-700 font-medium">צבע</span>
      </div>

      {/* פלטת צבעים – רק אם הפיקר סגור */}
      {!showPicker && (
        <>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {defaultColors.map(({ hex, name }) => (
              <div
                key={hex}
                onClick={() => onSelect(hex)}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform duration-150 ${
                  selectedColor === hex
                    ? "border-gray-600 shadow-md"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{ backgroundColor: hex }}
                title={`${name} – ${hex}`}
              />
            ))}
          </div>

          {customColors.length > 0 && (
            <div className="grid grid-cols-6 gap-2 mb-4">
              {customColors.map((hex: string) => (
                <div
                  key={hex}
                  onClick={() => onSelect(hex)}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform duration-150 ${
                    selectedColor === hex
                      ? "border-gray-600 shadow-md"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: hex }}
                  title={`מותאם אישית – ${hex}`}
                />
              ))}
            </div>
          )}

          {/* צבע רקע - גוונים נגזרים */}
          {selectedColor && selectedColor !== "#ffffff" && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700 font-medium">צבע רקע</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {getBackgroundColorVariants(selectedColor).map((hex, index) => (
                  <div
                    key={`bg-${hex}-${index}`}
                    onClick={() => onBackgroundSelect?.(hex)}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform duration-150 ${
                      selectedBackgroundColor === hex
                        ? "border-gray-600 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`גוון רקע – ${hex}`}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* כפתור הוספה */}
      {!showPicker && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPicker(true)}
            className="w-8 h-8 rounded-full bg-white border-2 border-dashed border-gray-400 hover:border-gray-600 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-150"
            title="הוסף צבע מותאם"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-sm text-gray-600">{selectedColor}</span>
          </div>
        </div>
      )}

      {/* Color Picker */}
      {showPicker && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <div className="mb-4">
            <div
              className="w-full h-32 rounded-lg mb-3 relative cursor-crosshair"
              style={{
                background: `linear-gradient(to right, hsl(${hue}, 0%, 100%), hsl(${hue}, 100%, 50%)),
                             linear-gradient(to bottom, transparent, hsl(0, 0%, 0%))`,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const newS = (x / rect.width) * 100;
                const newL = 100 - (y / rect.height) * 100;
                handleColorChange(hue, newS, newL);
              }}
            >
              <div
                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                }}
              />
            </div>

            <div className="relative">
              <div
                className="w-full h-4 rounded-full cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const newHue = (x / rect.width) * 360;
                  handleColorChange(newHue, saturation, lightness);
                }}
              >
                <div
                  className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-0"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                    top: "0px",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full border border-gray-300"
              style={{ backgroundColor: tempColor }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">
                {tempColor.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end text-sm">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
            >
              ביטול
            </button>
            <button
              onClick={handleAddColor}
              className="px-3 py-1 text-blue-600 hover:bg-gray-200 transition cursor-pointer"
            >
              הוספה
            </button>
          </div>
        </div>
      )}
    </div>
  );
};