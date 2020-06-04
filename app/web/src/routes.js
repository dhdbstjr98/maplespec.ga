import Search from './routes/Search.svelte';
import Character from './routes/Character.svelte';

const routes = {
  '/': Search,
  '/character': Character,
  '/character/:character': Character,
};

export default routes;