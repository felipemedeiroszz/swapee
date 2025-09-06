import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'pt-BR' | 'es' | 'fr' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to browser language
    const saved = localStorage.getItem('swapee-language') as Language;
    if (saved) return saved;
    
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('it')) return 'it';
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('swapee-language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language]?.[key] || translations.en[key] || key;
    
    if (params) {
      return Object.entries(params).reduce((text, [param, value]) => {
        return text.replace(`{{${param}}}`, value);
      }, translation);
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // App
    appName: 'Swapee',
    
    // Navigation
    discover: 'Discover',
    search: 'Search',
    add: 'Add Item',
    matches: 'Matches',
    profile: 'Profile',
    
    // Actions
    liked: '💖 Liked!',
    passed: '👋 Passed',
    youLiked: 'You liked: {{title}}',
    youPassed: 'You passed: {{title}}',
    endOfList: '🎉 End of list!',
    endOfListDesc: 'You\'ve seen all available products in your area.',
    
    // Product details
    category: 'Category',
    condition: 'Condition',
    location: 'Location',
    exchange: 'Exchange',
    donation: 'Donation',
    
    // Conditions
    all: 'All Conditions',
    new: 'New',
    likeNew: 'Like New',
    goodCondition: 'Good Condition',
    
    // Categories
    clothes: 'Clothes',
    accessories: 'Accessories',
    shoes: 'Shoes',
    electronics: 'Electronics',
    appliances: 'Appliances',
    tools: 'Tools',
    books: 'Books',
    toys: 'Toys',
    others: 'Others',
    categories: 'Categories',
    
    // Progress
    ofTotal: '{{current}} of {{total}}',
    
    // Congratulations
    congratulations: 'Congratulations!',
    allProductsViewed: 'You\'ve seen all available products in your area.',
    comeBackLater: 'Come back later to see new items!',
    
    // Filters
    filters: '🔍 Filters',
    filtersApplied: 'Filters applied successfully!',
    developmentFeature: 'Feature in development!',
    
    // Distance
    searchRadius: 'Search Radius',
    mile: 'mile',
    miles: 'miles',
    
    // Actions
    reset: 'Reset',
    apply: 'Apply',
    
    // Languages
    languages: 'Languages',
    english: 'English',
    portuguese: 'Português (Brasil)',
    spanish: 'Español',
    french: 'Français',
    italian: 'Italiano',

    // Chat
    matchesTitle: 'Matches',
    searchConversation: 'Search conversation',
    typing: 'typing...',
    onlineNow: 'Online now',
    offline: 'Offline',
    tabAll: 'All',
    tabUnread: 'Unread',
    tabPinned: 'Pinned',
    tabMuted: 'Muted',
    writeMessage: 'Write a message...',
    send: 'Send',
    attachments: 'Attachments',
    pinned: 'Pinned',
    muted: 'Muted',
    pinConversation: 'Pin',
    markAsUnread: 'Mark as unread',
    markAsRead: 'Mark as read',
    deleteConversation: 'Delete conversation',
    viewProfile: 'View profile',
    profileOf: 'Profile of {{name}}',
    publicInfoAndRatings: 'Public information and ratings.',
    memberSinceTrades: 'Member since {{year}} • {{trades}} trades',
    close: 'Close',
    unmute: 'Unmute',
    mute: 'Mute',
    actions: 'Actions',
    report: 'Report',
    block: 'Block',
    rateFive: 'Rate 5 stars',
    blockConfirmTitle: 'Block {{name}}?',
    blockConfirmDesc: 'You will no longer receive messages from this user.',
    cancel: 'Cancel',
    reportUserTitle: 'Report {{name}}',
    reportReason: 'Describe the reason for the report.',
    reportPlaceholder: 'Tell us what happened...',
    sendReport: 'Send report',

    // Notifications
    notifications: 'Notifications',
    viewAll: 'View all',
    markAllAsRead: 'Mark all as read',
    noNotifications: 'No notifications',
  },
  
  'pt-BR': {
    // App
    appName: 'Swapee',
    
    // Navigation
    discover: 'Descobrir',
    search: 'Buscar',
    add: 'Adicionar',
    matches: 'Matches',
    profile: 'Perfil',
    
    // Actions
    liked: '💖 Curtiu!',
    passed: '👋 Passou',
    youLiked: 'Você curtiu: {{title}}',
    youPassed: 'Você passou: {{title}}',
    endOfList: '🎉 Fim da lista!',
    endOfListDesc: 'Você viu todos os produtos disponíveis na sua região.',
    
    // Product details
    category: 'Categoria',
    condition: 'Condição',
    location: 'Localização',
    exchange: 'Troca',
    donation: 'Doação',
    
    // Conditions
    all: 'Todas as Condições',
    new: 'Novo',
    likeNew: 'Seminovo',
    goodCondition: 'Bom Estado',
    
    // Categories
    clothes: 'Roupas',
    accessories: 'Acessórios',
    shoes: 'Calçados',
    electronics: 'Eletrônicos',
    appliances: 'Eletrodomésticos',
    tools: 'Ferramentas',
    books: 'Livros',
    toys: 'Brinquedos',
    others: 'Outros',
    categories: 'Categorias',
    
    // Progress
    ofTotal: '{{current}} de {{total}}',
    
    // Congratulations
    congratulations: 'Parabéns!',
    allProductsViewed: 'Você viu todos os produtos disponíveis na sua região.',
    comeBackLater: 'Volte mais tarde para ver novos itens!',
    
    // Filters
    filters: '🔍 Filtros',
    filtersApplied: 'Filtros aplicados com sucesso!',
    developmentFeature: 'Funcionalidade em desenvolvimento!',
    
    // Distance
    searchRadius: 'Raio de Busca',
    mile: 'milha',
    miles: 'milhas',
    
    // Actions
    reset: 'Resetar',
    apply: 'Aplicar',
    
    // Languages
    languages: 'Idiomas',
    english: 'English',
    portuguese: 'Português (Brasil)',
    spanish: 'Español',
    french: 'Français',
    italian: 'Italiano',

    // Chat
    matchesTitle: 'Matches',
    searchConversation: 'Buscar conversa',
    typing: 'digitando...',
    onlineNow: 'Online agora',
    offline: 'Offline',
    tabAll: 'Todas',
    tabUnread: 'Não lidas',
    tabPinned: 'Fixadas',
    tabMuted: 'Silenciadas',
    writeMessage: 'Escreva uma mensagem...',
    send: 'Enviar',
    attachments: 'Anexos',
    pinned: 'Fixado',
    muted: 'Silenciado',
    pinConversation: 'Fixar',
    markAsUnread: 'Marcar como não lida',
    markAsRead: 'Marcar como lida',
    deleteConversation: 'Excluir conversa',
    viewProfile: 'Ver perfil',
    profileOf: 'Perfil de {{name}}',
    publicInfoAndRatings: 'Informações públicas e avaliações do usuário.',
    memberSinceTrades: 'Membro desde {{year}} • {{trades}} trocas',
    close: 'Fechar',
    unmute: 'Ativar',
    mute: 'Silenciar',
    actions: 'Ações',
    report: 'Denunciar',
    block: 'Bloquear',
    rateFive: 'Avaliar 5 estrelas',
    blockConfirmTitle: 'Bloquear {{name}}?',
    blockConfirmDesc: 'Você não receberá mais mensagens deste usuário.',
    cancel: 'Cancelar',
    reportUserTitle: 'Denunciar {{name}}',
    reportReason: 'Descreva o motivo da denúncia.',
    reportPlaceholder: 'Conte o que aconteceu...',
    sendReport: 'Enviar denúncia',

    // Notifications
    notifications: 'Notificações',
    viewAll: 'Ver todas',
    markAllAsRead: 'Marcar todas como lidas',
    noNotifications: 'Sem notificações',
  },
  
  es: {
    // App
    appName: 'Swapee',
    
    // Navigation
    discover: 'Descubrir',
    search: 'Buscar',
    add: 'Agregar',
    matches: 'Matches',
    profile: 'Perfil',
    
    // Actions
    liked: '💖 ¡Te gustó!',
    passed: '👋 Pasaste',
    youLiked: 'Te gustó: {{title}}',
    youPassed: 'Pasaste: {{title}}',
    endOfList: '🎉 ¡Fin de la lista!',
    endOfListDesc: 'Has visto todos los productos disponibles en tu área.',
    
    // Product details
    category: 'Categoría',
    condition: 'Condición',
    location: 'Ubicación',
    exchange: 'Intercambio',
    donation: 'Donación',
    
    // Conditions
    all: 'Todas las Condiciones',
    new: 'Nuevo',
    likeNew: 'Seminuevo',
    goodCondition: 'Buen Estado',
    
    // Categories
    clothes: 'Ropa',
    accessories: 'Accesorios',
    shoes: 'Zapatos',
    electronics: 'Electrónicos',
    appliances: 'Electrodomésticos',
    tools: 'Herramientas',
    books: 'Libros',
    toys: 'Juguetes',
    others: 'Otros',
    categories: 'Categorías',
    
    // Progress
    ofTotal: '{{current}} de {{total}}',
    
    // Congratulations
    congratulations: '¡Felicitaciones!',
    allProductsViewed: 'Has visto todos los productos disponibles en tu área.',
    comeBackLater: '¡Vuelve más tarde para ver nuevos artículos!',
    
    // Filters
    filters: '🔍 Filtros',
    filtersApplied: '¡Filtros aplicados exitosamente!',
    developmentFeature: '¡Función en desarrollo!',
    
    // Distance
    searchRadius: 'Radio de Búsqueda',
    mile: 'milla',
    miles: 'millas',
    
    // Actions
    reset: 'Resetear',
    apply: 'Aplicar',
    
    // Languages
    languages: 'Idiomas',
    english: 'English',
    portuguese: 'Português (Brasil)',
    spanish: 'Español',
    french: 'Français',
    italian: 'Italiano',

    // Chat tabs
    tabAll: 'Todas',
    tabUnread: 'No leídas',
    tabPinned: 'Fijadas',
    tabMuted: 'Silenciadas'
  },
  
  fr: {
    // App
    appName: 'Swapee',
    
    // Navigation
    discover: 'Découvrir',
    search: 'Rechercher',
    add: 'Ajouter',
    matches: 'Matches',
    profile: 'Profil',
    
    // Actions
    liked: '💖 Aimé !',
    passed: '👋 Passé',
    youLiked: 'Vous avez aimé : {{title}}',
    youPassed: 'Vous avez passé : {{title}}',
    endOfList: '🎉 Fin de la liste !',
    endOfListDesc: 'Vous avez vu tous les produits disponibles dans votre région.',
    
    // Product details
    category: 'Catégorie',
    condition: 'État',
    location: 'Localisation',
    exchange: 'Échange',
    donation: 'Don',
    
    // Conditions
    all: 'Toutes Conditions',
    new: 'Neuf',
    likeNew: 'Comme neuf',
    goodCondition: 'Bon état',
    
    // Categories
    clothes: 'Vêtements',
    accessories: 'Accessoires',
    shoes: 'Chaussures',
    electronics: 'Électronique',
    appliances: 'Électroménager',
    tools: 'Outils',
    books: 'Livres',
    toys: 'Jouets',
    others: 'Autres',
    categories: 'Catégories',
    
    // Progress
    ofTotal: '{{current}} sur {{total}}',
    
    // Congratulations
    congratulations: 'Félicitations !',
    allProductsViewed: 'Vous avez vu tous les produits disponibles dans votre région.',
    comeBackLater: 'Revenez plus tard pour voir de nouveaux articles !',
    
    // Filters
    filters: '🔍 Filtres',
    filtersApplied: 'Filtres appliqués avec succès !',
    developmentFeature: 'Fonctionnalité en développement !',
    
    // Distance
    searchRadius: 'Rayon de Recherche',
    mile: 'mile',
    miles: 'miles',
    
    // Actions
    reset: 'Réinitialiser',
    apply: 'Appliquer',
    
    // Languages
    discover: 'Scopri',
    search: 'Cerca',
    add: 'Aggiungi',
    matches: 'Match',
    profile: 'Profilo',
    
    // Actions
    liked: '💖 Ti piace!',
    passed: '👋 Saltato',
    youLiked: 'Ti è piaciuto: {{title}}',
    youPassed: 'Hai saltato: {{title}}',
    endOfList: '🎉 Fine della lista!',
    endOfListDesc: 'Hai visto tutti i prodotti disponibili nella tua zona.',
    
    // Product details
    category: 'Categoria',
    condition: 'Condizione',
    location: 'Posizione',
    exchange: 'Scambio',
    donation: 'Donazione',
    
    // Conditions
    all: 'Tutte le Condizioni',
    new: 'Nuovo',
    likeNew: 'Come nuovo',
    goodCondition: 'Buone condizioni',
    
    // Categories
    clothes: 'Abbigliamento',
    accessories: 'Accessori',
    shoes: 'Scarpe',
    electronics: 'Elettronica',
    appliances: 'Elettrodomestici',
    tools: 'Attrezzi',
    books: 'Libri',
    toys: 'Giocattoli',
    others: 'Altri',
    categories: 'Categorie',
    
    // Progress
    ofTotal: '{{current}} di {{total}}',
    
    // Congratulations
    congratulations: 'Congratulazioni!',
    allProductsViewed: 'Hai visto tutti i prodotti disponibili nella tua zona.',
    comeBackLater: 'Torna più tardi per vedere i nuovi articoli!',
    
    // Filters
    filters: '🔍 Filtri',
    filtersApplied: 'Filtri applicati con successo!',
    developmentFeature: 'Funzionalità in sviluppo!',
    
    // Distance
    searchRadius: 'Raggio di Ricerca',
    mile: 'miglio',
    miles: 'miglia',
    
    // Actions
    reset: 'Ripristina',
    apply: 'Applica',
    
    // Languages
    languages: 'Lingue',
    english: 'English',
    portuguese: 'Português (Brasil)',
    spanish: 'Español',
    french: 'Français',
    italian: 'Italiano'
  }
};