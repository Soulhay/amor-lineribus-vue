import './styles/course.css';
import { createApp } from 'vue';
import App from './App.vue';

// Same contract as the Angular remote: mount(el) / unmount().
// The shell does not know or care which framework is behind it.
let app = null;

export function mount(el) {
  app = createApp(App);
  app.mount(el);
}

export function unmount() {
  app?.unmount();
  app = null;
}