export interface CameraFeed {
  id: string;
  label: string;       // e.g., 'CAM 1'
  code: string;        // e.g., 'CAM-01'
  name: string;        // e.g., 'Singapore Camera 1'
  videoId: string;     // YouTube video ID
  originalUrl: string; // YouTube watch URL
  description: string; // 'Live video stream from YouTube.'
  source: string;      // 'YouTube Live Stream'
  aspectRatio: string; // '16:9'
}

export const CAMERAS: CameraFeed[] = [
  {
    id: 'cam-1',
    label: 'CAM 1',
    code: 'CAM-01',
    name: 'Woodlands Cam',
    videoId: 'AKpEtEcmClA',
    originalUrl: 'https://www.youtube.com/watch?v=AKpEtEcmClA',
    description: 'Live video stream from YouTube.',
    source: 'YouTube Live Stream',
    aspectRatio: '16:9',
  },
  {
    id: 'cam-2',
    label: 'CAM 2',
    code: 'CAM-02',
    name: 'CBD Live Stream 4K Webcam',
    videoId: 'w9PFn2beeFw',
    originalUrl: 'https://www.youtube.com/watch?v=w9PFn2beeFw',
    description: 'Live video stream from YouTube.',
    source: 'YouTube Live Stream',
    aspectRatio: '16:9',
  },
  {
    id: 'cam-3',
    label: 'CAM 3',
    code: 'CAM-03',
    name: 'Downtown Singapore',
    videoId: 'rQ3VvxadJeo',
    originalUrl: 'https://www.youtube.com/watch?v=rQ3VvxadJeo',
    description: 'Live video stream from YouTube.',
    source: 'YouTube Live Stream',
    aspectRatio: '16:9',
  },
  {
    id: 'cam-4',
    label: 'CAM 4',
    code: 'CAM-04',
    name: 'Tanjong Pagar Port of Singapore',
    videoId: 'Z7hAgOjTlbo',
    originalUrl: 'https://www.youtube.com/watch?v=Z7hAgOjTlbo',
    description: 'Live video stream from YouTube.',
    source: 'YouTube Live Stream',
    aspectRatio: '16:9',
  },
];
