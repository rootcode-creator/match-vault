export type FacetimeMeetingDto = {
  id: string;
  callId: string;
  description: string;
  startsAt: string; // ISO
  creatorId: string;
  creatorName?: string | null;
  creatorImage?: string | null;
  isCreator?: boolean;
  recipients?: Array<{
    id: string;
    name: string | null;
    image: string | null;
  }>;
};
