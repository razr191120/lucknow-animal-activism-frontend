/** Route prefix for L.A.A.P inside the unified LWBP app */
export const LA = {
  adoptions: '/laap/adoptions',
  adoptionNew: '/laap/adoptions/new',
  adoption: (id: string) => `/laap/adoptions/${id}`,
  rescues: '/laap/rescues',
  rescueNew: '/laap/rescues/new',
  rescue: (id: string) => `/laap/rescues/${id}`,
  donations: '/laap/donations',
  donationNew: '/laap/donations/new',
  donation: (id: string) => `/laap/donations/${id}`,
} as const;
