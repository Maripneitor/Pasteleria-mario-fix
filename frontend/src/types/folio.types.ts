export type FolioStatus =
    | 'Pendiente'
    | 'Nuevo'
    | 'En Producción'
    | 'Listo para Entrega'
    | 'Entregado'
    | 'Cancelado';

export type FolioType = 'Normal' | 'Base/Especial';
export type CakeShape = 'Redondo' | 'Cuadrado' | 'Rectangular' | 'Plancha';

export interface Ingredient {
    id: number;
    name: string;
    type: 'flavor' | 'filling' | 'decoration';
    price?: number;
    hasCost: boolean;
    isNormal: boolean;
}

export interface CakeTier {
    id?: number;
    persons: number;
    flavor: string | string[];
    filling: string | string[];
}

export interface Folio {
    id: number;
    folioNumber: string;
    client: {
        name: string;
        phone: string;
        email?: string;
    };
    deliveryDate: string;
    deliveryTime: string;
    persons: number;
    cakeFlavor: string[] | Ingredient[];
    filling: string[] | Ingredient[];
    designDescription: string;
    shape: CakeShape;
    folioType: FolioType;
    tiers?: CakeTier[];
    additional: Array<{
        description: string;
        price: number;
    }>;
    total: number;
    advancePayment: number;
    balance: number;
    status: FolioStatus;
    isPaid: boolean;
    signature?: string;
    imageUrls?: string[];
    createdAt: Date;
    updatedAt: Date;
    branchId?: number;
    createdBy: number;
}
