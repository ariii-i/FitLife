import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: "c0avhw9q",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
    token:`skMMKmGKNPMNjajQKHmwCLFIsZFQc4CPspfC0hoIm32rKoNRZaNzOd0kubt07QS6qZixBdxobiSHL5vjTwHcnmArs9iZVi7ikIF44TNZCxbRF9ppYFc7lLEDVAlByITM2cVK86v3aoRH9yEFoM7YGIcWC1pkkOoKLHCzp9udUQB1alF4AnL2`
})