'use client';

import React, { useMemo } from 'react';
import { AlbumProject, validateAlbumProject } from '@/lib/album-project';
import { AlbumBook } from '../AlbumBook';
import { AssetResolver } from './AssetResolver';
import { BookConfigAdapter } from './BookConfigAdapter';
import { RuntimeCoverRenderer } from './RuntimeCoverRenderer';
import { RuntimePageRenderer } from './RuntimePageRenderer';
import { RuntimeValidationReport } from './runtimeTypes';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface ProjectRendererProps {
  project: AlbumProject;
  onPhotoClick?: (assetId: string) => void;
  onCurrentPageChange?: (pageIndex: number) => void;
  bookRef?: React.MutableRefObject<{
    flipNext: () => void;
    flipPrev: () => void;
    turnToSpread: (spreadIndex: number) => void;
    turnToCover: () => void;
  } | null>;
  showValidationReport?: boolean;
}

export const ProjectRenderer: React.FC<ProjectRendererProps> = ({
  project,
  onPhotoClick,
  onCurrentPageChange,
  bookRef,
  showValidationReport = false,
}) => {
  // 1. Validate AlbumProject before rendering
  const validation = useMemo(() => {
    return validateAlbumProject(project);
  }, [project]);

  // 2. Initialize Asset Resolver
  const assetResolver = useMemo(() => {
    return new AssetResolver(project.assets || []);
  }, [project.assets]);

  // 3. Adapt physical book settings
  const adaptedBook = useMemo(() => {
    return BookConfigAdapter.adapt(project.book);
  }, [project.book]);

  const legacyConfig = useMemo(() => {
    return BookConfigAdapter.toAlbumConfig(project);
  }, [project]);

  // 4. Missing asset tracking
  const missingReferences = useMemo(() => {
    return assetResolver.findMissingReferences(project);
  }, [project, assetResolver]);

  // 5. Dynamic Page List with Odd/Even Balancing (Pure immutability)
  const { runtimePages, hasOddPageBalancing } = useMemo(() => {
    const pages = project.pages || [];
    const balanced = [...pages];
    let oddBalancingAdded = false;

    // Physical 3D books require paired leaves (2 pages per spread)
    if (balanced.length % 2 !== 0) {
      oddBalancingAdded = true;
      balanced.push({
        id: `runtime-blank-leaf-${Date.now()}`,
        pageIndex: balanced.length,
        background: {
          type: 'solid',
          color: adaptedBook.paperColor,
          opacity: 1,
        },
        elements: [],
        photoSlots: [],
        textElements: [],
        metadata: {
          isBlank: true,
          folioLabel: '',
        },
      });
    }

    return {
      runtimePages: balanced,
      hasOddPageBalancing: oddBalancingAdded,
    };
  }, [project.pages, adaptedBook.paperColor]);

  // Validation report summary
  const report: RuntimeValidationReport = useMemo(() => {
    return {
      valid: validation.valid && missingReferences.length === 0,
      projectName: project.name,
      projectId: project.projectId,
      totalPages: project.pages?.length || 0,
      hasOddPageBalancing,
      totalAssets: project.assets?.length || 0,
      missingAssets: missingReferences.map((m) => m.assetId),
      missingReferences,
      validationErrors: validation.errors?.map((e) => `${e.path}: ${e.message}`) || [],
    };
  }, [validation, missingReferences, project, hasOddPageBalancing]);

  // If project schema is invalid, display clean error notice instead of broken book
  if (!validation.valid) {
    return (
      <div className="w-full h-full min-h-[500px] bg-[#12100e] border border-red-500/30 rounded p-8 flex flex-col items-center justify-center text-center text-stone-200">
        <ShieldAlert className="w-12 h-12 text-red-400 mb-3" />
        <h3 className="text-base font-serif text-white mb-1">
          Cannot preview this project
        </h3>
        <p className="text-xs text-stone-400 max-w-md mb-4">
          The project data contains schema validation errors that must be resolved before 3D rendering.
        </p>
        <div className="bg-black/50 border border-white/10 rounded p-3 text-left font-mono text-[11px] text-red-300 max-w-lg max-h-48 overflow-y-auto space-y-1">
          {validation.errors?.map((err, idx) => (
            <div key={idx}>
              • <strong className="text-white">{err.path}:</strong> {err.message}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Build Rendered Nodes for AlbumBook
  const frontCoverNode = (
    <RuntimeCoverRenderer
      cover={project.frontCover}
      isFront={true}
      bookConfig={adaptedBook}
      assetResolver={assetResolver}
      onPhotoClick={onPhotoClick}
    />
  );

  const backCoverNode = (
    <RuntimeCoverRenderer
      cover={project.backCover}
      isFront={false}
      bookConfig={adaptedBook}
      assetResolver={assetResolver}
      onPhotoClick={onPhotoClick}
    />
  );

  const pageNodes = runtimePages.map((page, idx) => (
    <RuntimePageRenderer
      key={page.id}
      page={page}
      pageNumber={idx + 1}
      isLeft={idx % 2 === 0}
      isBlank={Boolean(page.metadata?.isBlank)}
      bookConfig={adaptedBook}
      assetResolver={assetResolver}
      onPhotoClick={onPhotoClick}
    />
  ));

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: adaptedBook.environmentBg,
      }}
      data-theme={adaptedBook.environmentTheme}
    >
      {/* Atmospheric Environment Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: adaptedBook.environmentGlow,
        }}
      />

      {/* Optional Debug / Diagnostic Validation Badge */}
      {showValidationReport && (
        <div className="absolute top-4 left-4 z-40 bg-[#161412]/90 border border-white/10 backdrop-blur-md rounded p-2.5 text-[10px] font-mono text-stone-300 space-y-1 shadow-xl">
          <div className="flex items-center justify-between gap-3 font-bold border-b border-white/10 pb-1">
            <span className="text-[#d4af37]">Runtime Ready</span>
            <span className={report.valid ? 'text-emerald-400' : 'text-amber-400'}>
              {report.valid ? '✓ PASS' : '⚠ WARNINGS'}
            </span>
          </div>
          <div>Pages: {report.totalPages} {report.hasOddPageBalancing ? '(+1 blank)' : ''}</div>
          <div>Assets: {report.totalAssets}</div>
          {report.missingReferences.length > 0 && (
            <div className="text-amber-400">Missing refs: {report.missingReferences.length}</div>
          )}
        </div>
      )}

      {/* Physical 3D AlbumBook */}
      <div className="w-full h-full flex items-center justify-center">
        <AlbumBook
          pages={pageNodes}
          frontCover={frontCoverNode}
          backCover={backCoverNode}
          config={legacyConfig}
          onCurrentPageChange={onCurrentPageChange}
          bookRef={bookRef}
        />
      </div>
    </div>
  );
};
