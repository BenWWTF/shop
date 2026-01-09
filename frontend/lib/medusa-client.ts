import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';

class MedusaClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // ============================================
  // PRODUCT ENDPOINTS
  // ============================================

  async getProducts(limit = 100, offset = 0) {
    try {
      const response = await this.client.get('/store/products', {
        params: { limit, offset },
      });
      return response.data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id: string) {
    try {
      const response = await this.client.get(`/store/products/${id}`);
      return response.data.product;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async searchProducts(q: string) {
    try {
      const response = await this.client.get('/store/products', {
        params: { q },
      });
      return response.data.products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // ============================================
  // CART ENDPOINTS
  // ============================================

  async createCart(items?: any[]) {
    try {
      const response = await this.client.post('/store/carts', { items });
      return response.data.cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  async getCart(cartId: string) {
    try {
      const response = await this.client.get(`/store/carts/${cartId}`);
      return response.data.cart;
    } catch (error) {
      console.error(`Error fetching cart ${cartId}:`, error);
      throw error;
    }
  }

  async addToCart(cartId: string, variantId: string, quantity: number) {
    try {
      const response = await this.client.post(
        `/store/carts/${cartId}/line-items`,
        {
          variant_id: variantId,
          quantity,
        }
      );
      return response.data.cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateLineItem(cartId: string, lineId: string, quantity: number) {
    try {
      const response = await this.client.post(
        `/store/carts/${cartId}/line-items/${lineId}`,
        { quantity }
      );
      return response.data.cart;
    } catch (error) {
      console.error('Error updating line item:', error);
      throw error;
    }
  }

  async removeLineItem(cartId: string, lineId: string) {
    try {
      const response = await this.client.delete(
        `/store/carts/${cartId}/line-items/${lineId}`
      );
      return response.data.cart;
    } catch (error) {
      console.error('Error removing line item:', error);
      throw error;
    }
  }

  // ============================================
  // PAYMENT ENDPOINTS
  // ============================================

  async initializePaymentSession(
    cartId: string,
    email: string,
    shippingAddress: any,
    billingAddress: any
  ) {
    try {
      const response = await this.client.post(
        `/store/carts/${cartId}/payment-sessions`,
        {
          email,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
        }
      );
      return response.data.cart;
    } catch (error) {
      console.error('Error initializing payment session:', error);
      throw error;
    }
  }

  async completeCart(cartId: string) {
    try {
      const response = await this.client.post(`/store/carts/${cartId}/complete`);
      return response.data.order;
    } catch (error) {
      console.error('Error completing cart:', error);
      throw error;
    }
  }

  // ============================================
  // REGION/SHIPPING ENDPOINTS
  // ============================================

  async getRegions() {
    try {
      const response = await this.client.get('/store/regions');
      return response.data.regions;
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  }

  async getShippingOptions(cartId: string) {
    try {
      const response = await this.client.get(
        `/store/shipping-options/${cartId}`
      );
      return response.data.shipping_options;
    } catch (error) {
      console.error('Error fetching shipping options:', error);
      throw error;
    }
  }

  // ============================================
  // COLLECTIONS ENDPOINTS
  // ============================================

  async getCollections() {
    try {
      const response = await this.client.get('/store/collections');
      return response.data.collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }

  async getCollection(handle: string) {
    try {
      const response = await this.client.get(`/store/collections/${handle}`);
      return response.data.collection;
    } catch (error) {
      console.error(`Error fetching collection ${handle}:`, error);
      throw error;
    }
  }
}

export const medusaClient = new MedusaClient();
