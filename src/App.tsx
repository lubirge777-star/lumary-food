import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  CakeSlice,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CupSoda,
  Headphones,
  Heart,
  LayoutGrid,
  LockKeyhole,
  Mail,
  Menu as MenuIcon,
  Minus,
  Pizza,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Soup,
  Star,
  Trash2,
  Truck,
  X,
  Zap,
  Sandwich,
} from 'lucide-react';
import {
  Avatar,
  BowlIllustration,
  Brand,
  Counter,
  Cursor,
  Dialog,
  LeafIllustration,
  LineReveal,
  LumaryBadge,
  Magnetic,
  Marquee,
  MedalIllustration,
  PhoneMockup,
  Reveal,
  ScooterIllustration,
  Stars,
  Tilt,
  TomatoIllustration,
} from './Artwork';
import './zesty.css';

type Category = 'All' | 'Burgers' | 'Pizza' | 'Asian' | 'Desserts' | 'Drinks';

type Product = {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  image: string;
  rating: string;
  reviews: number;
  price: number;
  oldPrice?: number;
  discount?: string;
};

const products: Product[] = [
  { id: 'veggie-pizza', name: 'Veggie Supreme Pizza', category: 'Pizza', image: '/images/pizza.jpg', rating: '4.8', reviews: 320, price: 7.49, oldPrice: 9.49, discount: '-20%' },
  { id: 'thai-noodles', name: 'Thai Basil Noodles', category: 'Asian', image: '/images/noodles.jpg', rating: '4.7', reviews: 210, price: 6.59 },
  { id: 'chicken-burger', name: 'Lumary Chicken Burger', category: 'Burgers', image: '/images/burger.jpg', rating: '4.9', reviews: 450, price: 5.49, oldPrice: 6.49, discount: '-15%' },
  { id: 'beef-burger', name: 'Smoky Double Burger', category: 'Burgers', image: '/images/beef-burger.jpg', rating: '4.9', reviews: 286, price: 8.49 },
  { id: 'lava-cake', name: 'Chocolate Lava Cake', category: 'Desserts', image: '/images/dessert.jpg', rating: '4.8', reviews: 194, price: 5.99 },
  { id: 'strawberry-lemonade', name: 'Strawberry Lemonade', category: 'Drinks', image: '/images/drink.jpg', rating: '4.7', reviews: 167, price: 3.99 },
  { id: 'margherita-pizza', name: 'Classic Margherita', category: 'Pizza', image: '/images/margherita.jpg', rating: '4.9', reviews: 352, price: 7.99 },
  { id: 'garden-salad', name: 'Fresh Garden Bowl', category: 'Asian', image: '/images/salad.jpg', rating: '4.8', reviews: 224, price: 6.99 },
];

const categories = [
  { name: 'All' as Category, Icon: LayoutGrid },
  { name: 'Burgers' as Category, Icon: Sandwich },
  { name: 'Pizza' as Category, Icon: Pizza },
  { name: 'Asian' as Category, Icon: Soup },
  { name: 'Desserts' as Category, Icon: CakeSlice },
  { name: 'Drinks' as Category, Icon: CupSoda },
];

const testimonials = [
  {
    name: 'Alex Morgan',
    quote: "We're proud to serve delicious food and great service every single time.",
    rating: '4.9',
    title: <>Loved By Thousands<br />Of Foodies</>,
    avatar: 'woman' as const,
  },
  {
    name: 'Jordan Lee',
    quote: 'Fresh, full of flavor, and at my door before I even finished setting the table.',
    rating: '5.0',
    title: <>Good Food. Great<br />Little Moments.</>,
    avatar: 'man' as const,
  },
  {
    name: 'Sam Taylor',
    quote: 'The kind of meal that turns an ordinary Tuesday into something worth celebrating.',
    rating: '4.9',
    title: <>A Favorite For<br />Every Craving</>,
    avatar: 'third' as const,
  },
];

const footerDetails: Record<string, string> = {
  Careers: 'We are always looking for people who believe good food makes a good day. Reach out to careers@lumary.example to say hello.',
  Blog: 'Fresh stories, kitchen inspiration, and more are on their way. Sign up for our newsletter to be first to know.',
  Press: 'For press information about the Lumary concept, contact the team behind this design preview.',
  FAQ: 'Need a hand? Our support team can help with orders, delivery, and everything in between at hello@lumary.example.',
  Shipping: 'Delivery times are shown before checkout. We work to get every meal to your door hot, fresh, and right on time.',
  Returns: 'If something is not right with your order, contact us within 7 days and we will make it right.',
  'Privacy Policy': 'Your information stays yours. This demo stores only your local preferences in your browser and does not process payments.',
  'Terms of Service': 'This Lumary website is an interactive design demo. Placing an order here creates a local preview only; no real purchase is made.',
  'Partner With Us': 'Bring your kitchen to more tables. Email partners@lumary.example to start a conversation.',
  'Add Your Restaurant': 'We would love to meet your restaurant. Email partners@lumary.example and tell us what makes your menu special.',
  'Manage Orders': 'Restaurant order management is coming soon. Contact partners@lumary.example for early access.',
  Resources: 'Everything your restaurant needs to grow with Lumary is coming soon. Contact partners@lumary.example for details.',
};

const ease = [0.22, 1, 0.36, 1] as const;

function getItemsPerPage() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 650) return 2;
  return 3;
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const heroParallax = useTransform(scrollY, [0, 700], [0, -45]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 70, damping: 22 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 70, damping: 22 });

  const [booting, setBooting] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeNav, setActiveNav] = useState('home');
  const [menuPage, setMenuPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [heroLoved, setHeroLoved] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = window.localStorage.getItem('lumary-cart');
      return saved ? JSON.parse(saved) : { 'veggie-pizza': 1, 'chicken-burger': 1 };
    } catch {
      return { 'veggie-pizza': 1, 'chicken-burger': 1 };
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const [infoTopic, setInfoTopic] = useState<string | null>(null);
  const [userName, setUserName] = useState(() => window.localStorage.getItem('lumary-name') || '');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterJoined, setNewsletterJoined] = useState(false);
  const [appEmail, setAppEmail] = useState('');
  const [appJoined, setAppJoined] = useState(false);
  const [toast, setToast] = useState('');

  const filteredProducts = useMemo(() => {
    if (activeSearch) return products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(activeSearch.toLowerCase()));
    return activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory);
  }, [activeCategory, activeSearch]);
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const visibleProducts = filteredProducts.slice(menuPage * itemsPerPage, (menuPage + 1) * itemsPerPage);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const cartTotal = products.reduce((total, product) => total + product.price * (cart[product.id] || 0), 0);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), reduceMotion ? 250 : 1800);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    const onResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => setMenuPage(0), [itemsPerPage]);
  useEffect(() => { window.localStorage.setItem('lumary-cart', JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    const onScroll = () => {
      let current = 'home';
      for (const id of ['home', 'why-us', 'menu', 'stories', 'offers']) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 150) current = id;
      }
      setActiveNav(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setActiveTestimonial((current) => (current + 1) % testimonials.length), 7500);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const overlayOpen = booting || cartOpen || videoOpen || signInOpen || appOpen || Boolean(infoTopic);
    document.body.style.overflow = overlayOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [booting, cartOpen, videoOpen, signInOpen, appOpen, infoTopic]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setCartOpen(false);
      setVideoOpen(false);
      setSignInOpen(false);
      setAppOpen(false);
      setInfoTopic(null);
      setSearchOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function goTo(id: string) {
    setMobileOpen(false);
    setSearchOpen(false);
    setActiveNav(id === 'top' ? 'home' : id);
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function chooseCategory(category: Category) {
    setActiveCategory(category);
    setActiveSearch('');
    setSearchInput('');
    setMenuPage(0);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveSearch(searchInput.trim());
    setActiveCategory('All');
    setMenuPage(0);
    setSearchOpen(false);
    window.setTimeout(() => goTo('menu'), 70);
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    const product = products.find((item) => item.id === id);
    setToast(favorites.includes(id) ? `${product?.name} removed from favorites` : `${product?.name} saved to favorites`);
  }

  function addToCart(product: Product) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
    setToast(`${product.name} added to your cart`);
  }

  function changeQuantity(id: string, amount: number) {
    setCart((current) => {
      const next = { ...current };
      next[id] = Math.max(0, (next[id] || 0) + amount);
      if (next[id] === 0) delete next[id];
      return next;
    });
  }

  function openCart() {
    setCartStep('cart');
    setCartOpen(true);
  }

  function submitSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email'));
    const name = email.split('@')[0].replace(/[._-]/g, ' ');
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    setUserName(displayName);
    window.localStorage.setItem('lumary-name', displayName);
    setSignInOpen(false);
    setToast(`Welcome to Lumary, ${displayName}!`);
  }

  function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterJoined(true);
    setToast('Subscription preview complete. No email was sent.');
  }

  function submitAppWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!appEmail.trim()) return;
    setAppJoined(true);
  }

  const searchSuggestions = products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(searchInput.toLowerCase())).slice(0, 4);

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-wrap">
        <div className="grain" aria-hidden="true" />
        <Cursor />
        <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

        <header className="site-header" id="top">
          <div className="shell header-inner">
            <Brand onClick={() => goTo('top')} />
            <nav className="desktop-nav" aria-label="Main navigation">
              <button className={activeNav === 'home' ? 'nav-active' : ''} onClick={() => goTo('top')}>Home</button>
              <button className={activeNav === 'menu' ? 'nav-active' : ''} onClick={() => goTo('menu')}>Menu</button>
              <button className={activeNav === 'why-us' ? 'nav-active' : ''} onClick={() => goTo('why-us')}>How It Works</button>
              <button className={activeNav === 'offers' ? 'nav-active' : ''} onClick={() => goTo('offers')}>Offers</button>
              <button className={activeNav === 'stories' ? 'nav-active' : ''} onClick={() => goTo('stories')}>About Us</button>
            </nav>
            <div className="header-actions">
              <button className="header-icon" onClick={() => setSearchOpen((open) => !open)} aria-label="Search menu" aria-expanded={searchOpen}><Search /></button>
              <button className="header-icon cart-trigger" onClick={openCart} aria-label={`Open cart with ${cartCount} items`}><ShoppingCart /><span className="cart-count">{cartCount}</span></button>
              <button className="sign-in-button" onClick={() => setSignInOpen(true)}>{userName ? `Hi, ${userName.split(' ')[0]}` : 'Sign In'}</button>
              <button className="header-icon mobile-menu-trigger" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={mobileOpen}>{mobileOpen ? <X /> : <MenuIcon />}</button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div className="search-panel shell" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <form onSubmit={submitSearch} className="search-form"><Search size={19} /><input aria-label="Search dishes" autoFocus placeholder="What are you craving?" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} /><button type="submit">Search <ArrowRight size={15} /></button></form>
                {searchInput && <div className="search-suggestions">{searchSuggestions.length ? searchSuggestions.map((product) => <button key={product.id} onClick={() => { setSearchInput(product.name); setActiveSearch(product.name); setActiveCategory('All'); setMenuPage(0); setSearchOpen(false); goTo('menu'); }}><img src={product.image} alt="" /><span>{product.name}</span><ArrowRight size={14} /></button>) : <p>No dishes found. Try pizza, burger, or noodles.</p>}</div>}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {mobileOpen && <motion.nav className="mobile-nav shell" aria-label="Mobile navigation" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {[['Home', 'top'], ['Menu', 'menu'], ['How It Works', 'why-us'], ['Offers', 'offers'], ['About Us', 'stories']].map(([label, id]) => <button key={label} onClick={() => goTo(id)}>{label}<ArrowRight size={16} /></button>)}
              <button onClick={() => { setMobileOpen(false); setSignInOpen(true); }}>{userName ? `Account: ${userName}` : 'Sign In'}<ArrowRight size={16} /></button>
            </motion.nav>}
          </AnimatePresence>
        </header>

        <main>
          <section className="hero shell" id="home" aria-labelledby="hero-title" onMouseMove={(event) => { if (reduceMotion || window.innerWidth < 700) return; const bounds = event.currentTarget.getBoundingClientRect(); pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 21); pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 16); }} onMouseLeave={() => { pointerX.set(0); pointerY.set(0); }}>
            <div className="hero-copy">
              <motion.div className="hero-kicker" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.04 }}><Zap size={12} fill="currentColor" /> Fresh · Fast · Luminous</motion.div>
              <h1 id="hero-title">
                <LineReveal delay={0.12}>Delicious Food,</LineReveal>
                <LineReveal delay={0.22} className="accent-line">Delivered <em>Fast</em></LineReveal>
                <LineReveal delay={0.32}>To Your Door</LineReveal>
              </h1>
              <motion.p className="hero-description" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}>Craving something tasty? Lumary delivers your favorite meals hot, fresh and on time.</motion.p>
              <motion.div className="hero-buttons" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <Magnetic><button className="primary-button hero-order" onClick={() => goTo('menu')}>Order Now <ArrowRight size={17} /></button></Magnetic>
                <button className="video-button" onClick={() => setVideoOpen(true)}><span className="play-circle"><Play size={11} fill="currentColor" /></span> Watch Video</button>
              </motion.div>
              <motion.div className="social-proof" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.48 }}>
                <span className="avatar-stack"><Avatar variant="woman" /><Avatar variant="man" /><Avatar variant="third" /></span>
                <span className="social-proof-text"><strong><Counter to={10} suffix="K+" /> Happy Customers</strong><span><Stars /> <b>(<Counter to={4.8} decimals={1} />)</b></span></span>
              </motion.div>
            </div>

            <div className="hero-stage">
              <motion.div className="hero-halo" initial={{ scale: 0.75, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.78, delay: 0.04, ease }} />
              <motion.svg className="hero-orbit" viewBox="0 0 440 390" fill="none" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }}><motion.path d="M20 179c14 78 89 164 224 162 82-1 153-59 174-145" stroke="#efcfb2" strokeWidth="1" strokeDasharray="3 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.7, delay: 0.35, ease }} /><path d="M48 128c-6 29-3 59 7 83M399 91c14 28 18 55 18 79" stroke="#efcfb2" strokeWidth="1" /></motion.svg>
              <motion.div className="hero-person-wrap" style={{ y: heroParallax }} initial={{ opacity: 0, scale: 0.88, x: 35 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.85, delay: 0.09, ease }}>
                <motion.img className="hero-person" src="/images/hero-woman.png" alt="Happy woman enjoying a fresh bowl of food" fetchPriority="high" style={{ x: smoothPointerX, y: smoothPointerY }} />
              </motion.div>
              <motion.div className="hero-leaf hero-leaf-one" animate={reduceMotion ? {} : { y: [0, -10, 0], rotate: [-10, 5, -10] }} transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}><LeafIllustration /></motion.div>
              <motion.div className="hero-leaf hero-leaf-two" animate={reduceMotion ? {} : { y: [0, 10, 0], rotate: [13, 0, 13] }} transition={{ duration: 6.6, repeat: Infinity, ease: 'easeInOut' }}><LeafIllustration /></motion.div>
              <span className="hero-speck speck-one" /><span className="hero-speck speck-two" /><span className="hero-speck speck-three" /><span className="hero-speck speck-four" /><span className="hero-speck speck-five" />
              <motion.button className={`heart-float ${heroLoved ? 'is-loved' : ''}`} onClick={() => { setHeroLoved((liked) => !liked); setToast(heroLoved ? 'Lumary removed from your favorites' : 'Thanks for loving Lumary!'); }} aria-label={heroLoved ? 'Unlike Lumary' : 'Love Lumary'} initial={{ opacity: 0, scale: 0.4, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} whileHover={{ scale: 1.13, rotate: 10 }} transition={{ type: 'spring', delay: 0.5, stiffness: 260, damping: 18 }}><Heart fill="currentColor" size={20} /></motion.button>
              <motion.div className="delivery-note float-note" initial={{ opacity: 0, y: 34, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', delay: 0.55, stiffness: 190, damping: 19 }}><Avatar variant="woman" /><span><small>Delivery Time</small><strong>20-30 mins</strong></span><i><Clock3 size={15} /></i></motion.div>
              <motion.div className="offer-note float-note" initial={{ opacity: 0, y: 34, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', delay: 0.64, stiffness: 190, damping: 19 }}><img src="/images/salad.jpg" alt="Fresh salad bowl" /><span><strong><em>50%</em> OFF</strong><small>On Your First Order</small></span></motion.div>
            </div>
          </section>

          <Marquee />

          <section className="why-section shell" id="why-us" aria-labelledby="why-heading">
            <Reveal className="section-heading centered-heading"><p className="eyebrow dotted-eyebrow">WHY CHOOSE US</p><h2 id="why-heading"><LineReveal>Your Favourite Food<br />Delivery Partner</LineReveal></h2></Reveal>
            <div className="features-grid">
              <Reveal className="feature" delay={0.04}><div className="feature-illustration"><ScooterIllustration /></div><h3>Lightning Fast</h3><p>Super quick delivery<br />right to your door.</p></Reveal>
              <Reveal className="feature" delay={0.16}><div className="feature-illustration"><BowlIllustration /></div><h3>Wide Variety</h3><p>Choose from a wide range<br />of cuisines and dishes.</p></Reveal>
              <Reveal className="feature" delay={0.28}><div className="feature-illustration"><MedalIllustration /></div><h3>Top Quality</h3><p>We use the freshest ingredients<br />for the best taste.</p></Reveal>
            </div>
          </section>

          <section className="menu-section shell" id="menu" aria-labelledby="menu-heading">
            <Reveal className="menu-header"><div><p className="eyebrow">EXPLORE OUR MENU</p><h2 id="menu-heading">{activeSearch ? `Results for "${activeSearch}"` : "Tasty Food You'll Love"}</h2></div><div className="slider-arrows"><button className="round-arrow" onClick={() => setMenuPage((page) => (page - 1 + pageCount) % pageCount)} aria-label="Previous dishes" disabled={pageCount === 1}><ChevronLeft /></button><button className="round-arrow arrow-next" onClick={() => setMenuPage((page) => (page + 1) % pageCount)} aria-label="Next dishes" disabled={pageCount === 1}><ChevronRight /></button></div></Reveal>
            <div className="menu-content">
              <nav className="category-list" aria-label="Food categories">{categories.map(({ name, Icon }) => <button key={name} className={`category-button ${activeCategory === name && !activeSearch ? 'selected' : ''}`} onClick={() => chooseCategory(name)} aria-pressed={activeCategory === name && !activeSearch}><Icon size={18} strokeWidth={2.15} /><span>{name}</span></button>)}</nav>
              <motion.div className="menu-grid" aria-live="polite" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: 0.08, ease }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {visibleProducts.map((product, index) => <Tilt className="food-card" key={product.id} layout initial={{ opacity: 0, y: 22, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -15, scale: 0.97 }} transition={{ duration: 0.42, delay: index * 0.07, ease }} whileHover={reduceMotion ? {} : { y: -7 }} max={7}>
                    <img className="food-image" src={product.image} alt={product.name} loading="lazy" />
                    <div className="food-shade" />
                    {product.discount && <span className="discount-tag">{product.discount}</span>}
                    <button className={`food-heart top-heart ${favorites.includes(product.id) ? 'favorite' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label={`${favorites.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${favorites.includes(product.id) ? 'from' : 'to'} favorites`}><Heart size={17} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button>
                    <div className="food-details"><h3>{product.name}</h3><div className="food-rating"><Star size={12} fill="currentColor" strokeWidth={0} /> <strong>{product.rating}</strong> <span>({product.reviews})</span></div><div className="food-price"><strong>${product.price.toFixed(2)}</strong>{product.oldPrice && <del>${product.oldPrice.toFixed(2)}</del>}</div><div className="food-actions"><button className="order-small" onClick={() => addToCart(product)}>Order Now</button><button className="food-heart bottom-heart" onClick={() => addToCart(product)} aria-label={`Quick add ${product.name} to cart`}><Plus size={17} /></button></div></div>
                  </Tilt>)}
                </AnimatePresence>
                {!visibleProducts.length && <div className="empty-results"><Soup size={34} /><h3>No dishes found</h3><p>Try searching for something else, or explore all of our tasty food.</p><button className="primary-button" onClick={() => chooseCategory('All')}>View All Food <ArrowRight size={16} /></button></div>}
              </motion.div>
            </div>
          </section>

          <section className="testimonials shell" id="stories" aria-labelledby="stories-heading">
            <div className="customer-visual">
              <motion.div className="customer-sun" initial={{ scale: 0.75, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.85, ease }} />
              <motion.img className="customer-man" src="/images/happy-customer.png" alt="Smiling customer holding a burger and giving a thumbs up" loading="lazy" initial={{ opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, delay: 0.1, ease }} />
              <motion.div className="customer-tomato" animate={reduceMotion ? {} : { rotate: [0, 14, 0], y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><TomatoIllustration /></motion.div>
              <motion.div className="customer-leaf" animate={reduceMotion ? {} : { rotate: [18, 2, 18], y: [0, 6, 0] }} transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}><LeafIllustration /></motion.div>
              <span className="customer-ring" />
              <motion.div className="customer-proof float-note" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.55 }}><span>Our Happy Customers</span><span className="customer-proof-bottom"><span className="avatar-stack"><Avatar variant="woman" /><Avatar variant="man" /><Avatar variant="third" /><Avatar variant="woman" /></span><strong><Counter to={12} suffix="K+" /></strong></span></motion.div>
            </div>
            <Reveal className="testimonial-copy"><p className="eyebrow">WHAT OUR CUSTOMERS SAY</p><AnimatePresence mode="wait"><motion.div key={activeTestimonial} initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -13, filter: 'blur(5px)' }} transition={{ duration: 0.44, ease }}><h2 id="stories-heading">{testimonials[activeTestimonial].title}</h2><p className="testimonial-quote">{testimonials[activeTestimonial].quote}</p><div className="reviewer"><Avatar variant={testimonials[activeTestimonial].avatar} /><span><strong>{testimonials[activeTestimonial].name}</strong><span><Stars /> <small>{testimonials[activeTestimonial].rating}</small></span></span></div></motion.div></AnimatePresence><div className="testimonial-dots" aria-label="Choose a testimonial">{testimonials.map((testimonial, index) => <button key={testimonial.name} className={index === activeTestimonial ? 'active' : ''} onClick={() => setActiveTestimonial(index)} aria-label={`Show testimonial ${index + 1}`} aria-current={index === activeTestimonial ? 'true' : undefined} />)}</div><div className="testimonial-arrows slider-arrows"><button className="round-arrow" onClick={() => setActiveTestimonial((current) => (current - 1 + testimonials.length) % testimonials.length)} aria-label="Previous testimonial"><ChevronLeft /></button><button className="round-arrow arrow-next" onClick={() => setActiveTestimonial((current) => (current + 1) % testimonials.length)} aria-label="Next testimonial"><ChevronRight /></button></div></Reveal>
          </section>

          <section className="app-banner shell" id="offers" aria-labelledby="app-heading">
            <span className="banner-plus plus-one">+</span><span className="banner-plus plus-two">+</span><span className="banner-dot dot-one" /><span className="banner-dot dot-two" /><LeafIllustration className="banner-leaf" />
            <Reveal className="app-copy"><p className="eyebrow">DOWNLOAD OUR APP</p><h2 id="app-heading"><LineReveal delay={0.1}>Get Exclusive Offers</LineReveal><LineReveal delay={0.2}>On The Lumary App!</LineReveal></h2><p>Download now and enjoy special discounts,<br />fast delivery and easy tracking.</p><Magnetic strength={0.25}><button className="primary-button app-main-button" onClick={() => setAppOpen(true)}>Download App <ArrowRight size={15} /></button></Magnetic></Reveal>
            <motion.div className="app-brand-tile" initial={{ opacity: 0, scale: 0.7, rotate: -12 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 140, damping: 12, delay: 0.2 }}><LumaryBadge className="app-brand-badge" /><strong>Lumary</strong></motion.div>
            <div className="store-buttons"><button className="store-button" onClick={() => setAppOpen(true)} aria-label="Get Lumary on Google Play"><span className="google-play-mark"><svg viewBox="0 0 24 26"><path fill="#34A853" d="M2 2v22l11-11z" /><path fill="#4285F4" d="m2 2 14 9-3 2z" /><path fill="#EA4335" d="m2 24 14-9-3-2z" /><path fill="#FBBC04" d="m13 13 3-2 5 3c1 .6 1 1.4 0 2l-5 3-3-3z" /></svg></span><span><small>GET IT ON</small><strong>Google Play</strong></span></button><button className="store-button" onClick={() => setAppOpen(true)} aria-label="Download Lumary on the App Store"><span className="apple-mark"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.1 12.4c0-2.1 1.7-3.1 1.8-3.2-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.2 1.9-1.3 2.2-.4 5.5.9 7.4.7 1 1.5 2 2.5 2 1 0 1.4-.7 2.6-.7s1.5.7 2.6.7c1 0 1.7-.9 2.4-1.9.8-1.2 1.2-2.3 1.2-2.4-2-.8-2.5-2.3-2.5-3.2ZM15.5 6.6c.6-.7 1-1.7.9-2.6-.9.1-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.5 1 .1 1.9-.4 2.5-1.2Z" /></svg></span><span><small>Download on the</small><strong>App Store</strong></span></button></div>
            <div className="phone-viewport"><motion.div className="phone-float" animate={reduceMotion ? {} : { y: [0, -9, 0], rotate: [7, 5, 7] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}><PhoneMockup /></motion.div></div>
          </section>
        </main>

        <div className="service-strip shell" aria-label="Lumary benefits"><div className="service-item"><Truck className="service-orange" /><span><strong>Free Delivery</strong><small>On orders over $20</small></span></div><div className="service-item"><RefreshCw className="service-orange" /><span><strong>Easy Returns</strong><small>Within 7 days</small></span></div><div className="service-item"><ShieldCheck className="service-green" /><span><strong>Secure Payment</strong><small>100% protected</small></span></div><div className="service-item"><Headphones /><span><strong>24/7 Support</strong><small>We're here to help</small></span></div></div>

        <footer className="site-footer shell" id="footer"><div className="footer-grid"><div className="footer-about"><Brand footer onClick={() => goTo('top')} /><p>Good food. Fast delivery.<br />Every single day.</p><div className="social-links"><a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><strong>f</strong></a><a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a><a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><strong>X</strong></a><a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8a3 3 0 0 0-2.1-2.1C18 5.4 12 5.4 12 5.4s-6 0-7.9.5A3 3 0 0 0 2 8a31 31 0 0 0 0 8 3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5A3 3 0 0 0 22 16a31 31 0 0 0 0-8ZM10 15.3V8.7l5.6 3.3L10 15.3Z" /></svg></a></div></div><div className="footer-column"><h3>Company</h3><button onClick={() => goTo('stories')}>About Us</button><button onClick={() => setInfoTopic('Careers')}>Careers</button><button onClick={() => setInfoTopic('Blog')}>Blog</button><button onClick={() => setInfoTopic('Press')}>Press</button></div><div className="footer-column"><h3>Support</h3>{['FAQ', 'Shipping', 'Returns', 'Privacy Policy', 'Terms of Service'].map((item) => <button key={item} onClick={() => setInfoTopic(item)}>{item}</button>)}</div><div className="footer-column"><h3>For Restaurants</h3>{['Partner With Us', 'Add Your Restaurant', 'Manage Orders', 'Resources'].map((item) => <button key={item} onClick={() => setInfoTopic(item)}>{item}</button>)}</div><div className="footer-column newsletter-column"><h3>Newsletter</h3><p>Subscribe for latest offers</p><form className="newsletter-form" onSubmit={submitNewsletter}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" required placeholder={newsletterJoined ? 'Preview complete!' : 'Enter your email'} value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} disabled={newsletterJoined} /><button type="submit" disabled={newsletterJoined} aria-label="Subscribe to newsletter">{newsletterJoined ? <Check /> : <ArrowRight />}</button></form></div></div><div className="footer-brandline"><button className="back-to-top" onClick={() => goTo('top')} aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5m-7 7 7-7 7 7" /></svg></button><span className="footer-wordmark" aria-hidden="true">Lumary</span></div></footer>

        <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 25, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}><Check size={16} />{toast}</motion.div>}</AnimatePresence>

        <AnimatePresence>
          {cartOpen && <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 280, damping: 32 }}><div className="drawer-heading"><div><p className="eyebrow">GOOD FOOD IS COMING</p><h2>{cartStep === 'success' ? 'All set!' : cartStep === 'checkout' ? 'Your details' : 'Your Cart'}</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button></div>{cartStep === 'cart' ? <><div className="cart-items">{products.filter((product) => cart[product.id]).map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt="" /><div><h3>{product.name}</h3><span>${product.price.toFixed(2)}</span><div className="quantity-control"><button onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={13} /></button><strong>{cart[product.id]}</strong><button onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={13} /></button></div></div><button className="remove-item" onClick={() => changeQuantity(product.id, -cart[product.id])} aria-label={`Remove ${product.name}`}><Trash2 size={16} /></button></div>)}{cartCount === 0 && <div className="cart-empty"><ShoppingCart size={42} /><h3>Nothing in your cart yet</h3><p>Something delicious is just around the corner.</p><button className="primary-button" onClick={() => { setCartOpen(false); goTo('menu'); }}>Explore Menu <ArrowRight size={16} /></button></div>}</div>{cartCount > 0 && <div className="cart-bottom"><div><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div><p>Delivery is free on orders over $20.</p><button className="primary-button checkout-button" onClick={() => setCartStep('checkout')}>Continue to Checkout <ArrowRight size={18} /></button></div>}</> : cartStep === 'checkout' ? <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setCart({}); setCartStep('success'); }}><label>Full name<input required autoComplete="name" placeholder="Your name" defaultValue={userName} /></label><label>Email address<input required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Delivery address<input required autoComplete="street-address" placeholder="Street address, city, ZIP" /></label><div className="checkout-summary"><span>Order total</span><strong>${cartTotal.toFixed(2)}</strong></div><p className="demo-note"><LockKeyhole size={15} /> This is a local preview. No payment will be taken.</p><button className="primary-button checkout-button" type="submit">Place Preview Order <ArrowRight size={18} /></button><button className="text-back" type="button" onClick={() => setCartStep('cart')}>Back to cart</button></form> : <div className="order-success"><span><Check size={39} /></span><h3>Your preview order is in!</h3><p>Thanks for exploring Lumary. This was a demo order, so no payment was taken and no delivery is scheduled.</p><button className="primary-button" onClick={() => { setCartOpen(false); goTo('menu'); }}>Explore More Food <ArrowRight size={16} /></button></div>}</motion.aside></motion.div>}
        </AnimatePresence>

        <AnimatePresence>{videoOpen && <Dialog title="Watch the Lumary story" onClose={() => setVideoOpen(false)} className="video-dialog"><div className="video-header"><p className="eyebrow">THE LUMARY WAY</p><h2>Fresh moments, delivered.</h2></div><video autoPlay controls playsInline poster="https://images.pexels.com/videos/3195728/free-video-3195728.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"><source src="https://videos.pexels.com/video-files/3195728/3195728-uhd_3840_2160_25fps.mp4" type="video/mp4" />Your browser does not support video.</video><p>Made fresh. Made with care. Made for the moments that matter.</p></Dialog>}</AnimatePresence>

        <AnimatePresence>{signInOpen && <Dialog title="Sign in to Lumary" onClose={() => setSignInOpen(false)} className="form-dialog"><span className="dialog-brand"><Brand onClick={() => { setSignInOpen(false); goTo('top'); }} /></span><p className="eyebrow">WELCOME BACK</p><h2>Good to see you again.</h2><p className="dialog-intro">Your next favorite meal is waiting.</p><form onSubmit={submitSignIn}><label>Email address<span><Mail size={17} /><input type="email" name="email" required autoComplete="email" placeholder="you@example.com" /></span></label><label>Demo password<span><LockKeyhole size={17} /><input type="password" name="password" minLength={4} required autoComplete="off" placeholder="Any 4 characters" /></span></label><button className="primary-button dialog-submit" type="submit">Sign In <ArrowRight size={17} /></button></form><small className="form-footnote">Do not use a real password. This preview saves only your display name locally.</small></Dialog>}</AnimatePresence>

        <AnimatePresence>{appOpen && <Dialog title="Get the Lumary app" onClose={() => setAppOpen(false)} className="form-dialog app-dialog"><div className="mini-app-mark"><Brand onClick={() => setAppOpen(false)} /></div>{appJoined ? <div className="waitlist-success"><span><Check /></span><h2>Preview complete!</h2><p>Thanks for exploring the app flow. This demo did not send your email or add you to a real waitlist.</p><button className="primary-button" onClick={() => setAppOpen(false)}>Sounds Good <ArrowRight size={16} /></button></div> : <><p className="eyebrow">SOMETHING TASTY IS COMING</p><h2>Get Lumary in your pocket.</h2><p className="dialog-intro">The Lumary app is coming soon. Try the waitlist experience for launch updates and first-order offers.</p><form onSubmit={submitAppWaitlist}><label>Email address<span><Mail size={17} /><input type="email" required placeholder="you@example.com" value={appEmail} onChange={(event) => setAppEmail(event.target.value)} /></span></label><button className="primary-button dialog-submit" type="submit">Preview the Waitlist <ArrowRight size={17} /></button></form><small className="form-footnote">Design demo only. Your email will not be sent.</small></>}</Dialog>}</AnimatePresence>

        <AnimatePresence>{infoTopic && <Dialog title={infoTopic} onClose={() => setInfoTopic(null)} className="info-dialog"><p className="eyebrow">LUMARY INFORMATION</p><h2>{infoTopic}</h2><p>{footerDetails[infoTopic]}</p><button className="primary-button" onClick={() => setInfoTopic(null)}>Got It <ArrowRight size={16} /></button></Dialog>}</AnimatePresence>

        <AnimatePresence>
          {booting && (
            <motion.div className="preloader" exit={{ y: '-102%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
              <div className="preloader-card">
                <motion.div className="preloader-logo" initial={{ scale: 0.55, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 14 }}>
                  <LumaryBadge />
                </motion.div>
                <motion.div className="preloader-name" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease }}>Lumary</motion.div>
                <div className="preloader-line"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.45, ease: 'easeInOut' }} /></div>
                <motion.div className="preloader-tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.5 }}>Lighting Up Your Table</motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
