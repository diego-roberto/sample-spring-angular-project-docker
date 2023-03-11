import { Injectable } from '@angular/core';

@Injectable()
export class LoadingStackService {

  loadingStack: Set<string> = new Set<string>();

  constructor() { }

  addToLoadingStack(key: string) {
    this.loadingStack.add(key);
  }

  removeFromLoadingStack(key: string) {
    this.loadingStack.delete(key);
  }

  isLoadingActive(key?: string): boolean {
    if (key) { return this.loadingStack.has(key); }

    return this.loadingStack.size > 0;
  }

}
