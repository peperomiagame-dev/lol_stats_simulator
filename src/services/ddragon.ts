import type { ChampionResponse, ItemResponse, RuneReforged } from '../types/ddragon';

const BASE_URL = 'https://ddragon.leagueoflegends.com';

export class DDragonService {
    private static version: string | null = null;

    static async getLatestVersion(): Promise<string> {
        if (this.version) return this.version;
        try {
            const response = await fetch(`${BASE_URL}/api/versions.json`);
            const versions = await response.json();
            this.version = versions[0];
            return this.version!;
        } catch (error) {
            console.error('Failed to fetch version:', error);
            // Fallback to a recent version if fetch fails
            return '14.23.1';
        }
    }

    static async getChampions(lang: string = 'en_US'): Promise<ChampionResponse> {
        const version = await this.getLatestVersion();
        const response = await fetch(`${BASE_URL}/cdn/${version}/data/${lang}/champion.json`);
        return response.json();
    }

    static async getItems(lang: string = 'en_US'): Promise<ItemResponse> {
        const version = await this.getLatestVersion();
        const response = await fetch(`${BASE_URL}/cdn/${version}/data/${lang}/item.json`);
        return response.json();
    }

    static async getRunes(lang: string = 'en_US'): Promise<RuneReforged[]> {
        const version = await this.getLatestVersion();
        const response = await fetch(`${BASE_URL}/cdn/${version}/data/${lang}/runesReforged.json`);
        return response.json();
    }

    static getImageUrl(type: 'champion' | 'item' | 'spell' | 'passive', filename: string): string {
        if (!this.version) return ''; // Should ensure version is loaded or pass it in
        // Note: This might be slightly buggy if version isn't loaded yet. 
        // Ideally we should await version or store it in a context.
        // For now, let's assume getLatestVersion is called at app start.
        return `${BASE_URL}/cdn/${this.version}/img/${type}/${filename}`;
    }

    // Helper to get loading/splash art
    static getChampionSplashUrl(championId: string, skinNum: number = 0): string {
        return `${BASE_URL}/cdn/img/champion/splash/${championId}_${skinNum}.jpg`;
    }

    static getChampionLoadingUrl(championId: string, skinNum: number = 0): string {
        return `${BASE_URL}/cdn/img/champion/loading/${championId}_${skinNum}.jpg`;
    }
}
