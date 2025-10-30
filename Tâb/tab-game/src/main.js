import { initRouter, navigateTo } from './core/router.js';
import { initState } from './core/state.js';

window.addEventListener('DOMContentLoaded', () => {
  initState();
  initRouter();
  navigateTo('menu');
});
