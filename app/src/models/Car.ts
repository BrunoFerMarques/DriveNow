export interface ICarData {
    id: string;
    brand: string;
    model: string;
    year: number;
    imageUrl?: string;
    type: string;
    price: number;
    available: boolean;
}

export class Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    imageUrl?: string;
    type: string;
    price: number;
    available: boolean;

    constructor(data: ICarData) {
        this.id = data.id;
        this.brand = data.brand;
        this.model = data.model;
        this.year = data.year;
        this.imageUrl = data.imageUrl;
        this.type = data.type;
        this.price = data.price;
        this.available = data.available;
    }

    get displayName(): string {
        return `${this.brand} ${this.model}`;
    }

    get formattedPrice(): string {

        const value = this.price * 0.0005;
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    get statusLabel(): string {
        return this.available ? 'Disponível' : 'Indisponível';
    }

    get statusColor(): string {
        return this.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    }

    get displayImage(): string {
        return (this.imageUrl && this.imageUrl.trim() !== '')
            ? this.imageUrl
            : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';
    }
}
