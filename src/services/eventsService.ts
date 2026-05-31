import axiosInstance from "./axiosInstance";

export interface Event {
  id: string;
  placeId: string;
  title: string;
  description: string;
  datetime: string;
  capacity: number;
  bookedTickets: number;
  isSoldOut: boolean;
  canJoinWaitlist: boolean;
  price: number;
  status: string;
  isWaitlistEnabled: boolean;
  rowVersion: string;
}

export interface CreateEventRequest {
  placeId: string;
  title: string;
  description: string;
  galleryImages?: string;
  datetime: string;
  capacity: number;
  price: number;
  isWaitlistEnabled: boolean;
  waitlistLimit?: number;
}

export const eventsAPI = {
  getByPlace: async (placeId: string): Promise<Event[]> => {
    const response = await axiosInstance.get("/api/Events/active");
    return (response.data as Event[]).filter((e) => e.placeId === placeId);
  },

  create: async (data: CreateEventRequest): Promise<Event> => {
    const response = await axiosInstance.post("/api/Events", data);
    return response.data;
  },

  update: async (eventId: string, data: Partial<CreateEventRequest> & { rowVersion: string }): Promise<Event> => {
    const response = await axiosInstance.put(`/api/Events/${eventId}`, data);
    return response.data;
  },

  delete: async (eventId: string): Promise<void> => {
    await axiosInstance.delete(`/api/Events/${eventId}`);
  },
};
