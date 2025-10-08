import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private api =
    typeof (globalThis as any).chrome !== 'undefined' ? (globalThis as any).chrome : undefined;

  async getLocal<T = any>(key: string): Promise<T | null> {
    if (!this.api?.storage?.local) {
      console.warn('Chrome API not available');
      return null;
    }

    return new Promise((resolve) => {
      this.api.storage.local.get([key], (result: any) => {
        resolve(result?.[key] ?? null);
      });
    });
  }

  async setLocal(key: string, value: any): Promise<void> {
    if (!this.api?.storage?.local) return;
    return new Promise((resolve) => {
      this.api.storage.local.set({ [key]: value }, () => resolve());
    });
  }
}
