import React, { useState } from 'react';
import { EvidenceItem } from '../../types';
import { SeverityTag } from '../common/RiskBadge';
import { ZoomIn, X } from 'lucide-react';

interface EvidenceGalleryProps {
  evidence: EvidenceItem[];
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({ evidence }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="rounded-2xl bg-aubergine-surface/40 border border-white/10 p-5 sm:p-6">
      
      <div className="pb-3 mb-4 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 block">
          Artifacts Dossier
        </span>
        <h3 className="font-display font-bold text-lg text-white">
          Forensic Evidence Exhibits ({evidence.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {evidence.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-aubergine-950/60 border border-white/5 p-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-lavender/50">
                  {item.timestamp}
                </span>
                <SeverityTag severity={item.severity} text={item.type} />
              </div>

              <h4 className="font-sans font-semibold text-xs text-white mb-1">
                {item.title}
              </h4>

              <p className="font-sans text-xs text-lavender/70 mb-3 leading-relaxed">
                {item.detail}
              </p>
            </div>

            {item.screenshot_url && (
              <div
                onClick={() => setSelectedImage(item.screenshot_url || null)}
                className="relative rounded-lg overflow-hidden border border-white/10 group cursor-pointer aspect-video bg-black/40 flex items-center justify-center"
              >
                <img
                  src={item.screenshot_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-xs font-sans text-white transition-opacity">
                  <ZoomIn className="w-4 h-4 text-cyan-400" />
                  <span>Enlarge</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-aubergine-900 border border-white/15 rounded-2xl p-4 shadow-2xl flex flex-col">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-auto flex-1 flex items-center justify-center p-2">
              <img
                src={selectedImage}
                alt="Enlarged Exhibit"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
