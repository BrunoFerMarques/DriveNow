import { Car, ICarData } from '../models/Car';

export class CarService {

    static async getAll(): Promise<Car[]> {
        try {
            const res = await fetch(`/api/cars?type=RENT`, { cache: "no-store" });
            if (!res.ok) throw new Error('Failed to fetch cars');
            const data: ICarData[] = await res.json();
            return data.map(item => new Car(item));
        } catch (error) {
            console.error('Error fetching cars:', error);
            return [];
        }
    }

    static async getAllByPopularity(): Promise<Car[]> {
        try {
            const res = await fetch(`/api/cars?sort=popular`, { cache: "no-store" });
            if (!res.ok) throw new Error('Failed to fetch cars by popularity');
            const data: ICarData[] = await res.json();
            return data.map(item => new Car(item));
        } catch (error) {
            console.error('Error fetching cars by popularity:', error);
            return [];
        }
    }

    static async getById(id: string): Promise<Car | null> {
        try {
            const res = await fetch(`/api/cars/${id}`, { cache: "no-store" });
            if (!res.ok) return null;
            const data: ICarData = await res.json();
            return new Car(data);
        } catch (error) {
            console.error(`Error fetching car ${id}:`, error);
            return null;
        }
    }

    static async rent(transactionData: {
        carId: string;
        days: number;
        pickupLocation: string;
        startDate: string;
        paymentMethod: string;
    }): Promise<{ success: boolean; error?: string }> {

        try {
            const res = await fetch(`/api/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData)
            });

            if (res.ok) {
                return { success: true };
            } else {
                const data = await res.json();
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Transaction failed:', error);
            return { success: false, error: 'Falha na transação' };
        }
    }
}
