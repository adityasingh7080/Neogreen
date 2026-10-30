import { api } from "@/lib/api";

// Inside your component's submit handler:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // 1. Explicitly map your form inputs to match the backend schema
    const payload = {
      electricity_kwh: Number(formData.electricity_kwh || 0),
      diesel_liters: Number(formData.diesel_liters || 0),
      vehicle_km: Number(formData.vehicle_km || 0),
      flight_hours: Number(formData.flight_hours || 0),
      employee_commute_km: Number(formData.employee_commute_km || 0),
      waste_kg: Number(formData.waste_kg || 0)
    };

    // 2. Call the endpoint relative to baseURL (do NOT add /api/v1 prefix here)
    const response = await api.post("/calculator/calculate", payload);
    
    // 3. Save response to state
    setResult(response.data);
  } catch (error) {
    console.error("Calculation failed:", error);
  }
};