import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Play, Clipboard } from 'lucide-react';
import VideoCard from './VideoCard';
import { formatDuration } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * RoutineDetailView Component
 * Displays and manages videos within a selected routine
 * Supports drag-and-drop reordering and workout logging
 */
const RoutineDetailView = ({ routine, onUpdateRoutine, onRemoveVideo, onPlayVideo, onLogWorkout }) => {
  const { t } = useLanguage();
  
  if (!routine) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">{t('selectRoutine')}</p>
      </div>
    );
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(routine.videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update routine with new video order
    const videoIds = items.map(video => video._id);
    onUpdateRoutine({ videos: videoIds });
  };

  const totalDuration = routine.videos?.reduce((sum, video) => sum + video.duration, 0) || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{routine.name}</h2>
        {routine.description && (
          <p className="text-gray-600 mb-2">{routine.description}</p>
        )}
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{routine.videos?.length || 0} {routine.videos?.length === 1 ? t('video') : t('videos')}</span>
          <span>•</span>
          <span>{t('totalDuration')}: {formatDuration(totalDuration, t)}</span>
        </div>
      </div>

      {routine.videos && routine.videos.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="routine-videos">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
              >
                {routine.videos.map((video, index) => (
                  <Draggable key={video._id} draggableId={video._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-gray-50 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        {/* Drag Handle */}
                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-32 h-20 object-cover rounded block"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-200 flex items-center justify-center pointer-events-none rounded">
                            <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1 py-0.5 rounded">
                            {formatDuration(video.duration)}
                          </div>
                          
                          {/* AI Status Indicator */}
                          {video.status === 'completed' && video.segments && video.segments.length > 0 && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                              ✓ {video.segments.length}
                            </div>
                          )}
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => onPlayVideo(video)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1"
                            title="Play video"
                          >
                            <Play className="w-4 h-4" />
                            {t('play') || 'Play'}
                          </button>
                          
                          {onLogWorkout && (
                            <button
                              onClick={() => onLogWorkout(video)}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1"
                              title="Log workout"
                            >
                              <Clipboard className="w-4 h-4" />
                              {t('log') || 'Log'}
                            </button>
                          )}
                          
                          <button
                            onClick={() => onRemoveVideo(video._id)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                          >
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>{t('emptyRoutine')}</p>
        </div>
      )}
    </div>
  );
};

export default RoutineDetailView;

