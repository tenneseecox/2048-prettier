# 2048 Prettier

A modern, optimized implementation of the classic 2048 game built with Next.js, React, TypeScript, and Tailwind CSS.

![2048 Prettier Game - Screenshot showing the game board with various tiles (2, 4, 8, 16, 32, 128, 256) and a score of 2676 with a best score of 6484](/public/2048-prettier-preview.png)

## Features

- 🎮 Classic 2048 gameplay with smooth animations
- 🎯 Achievement toasts for milestone tiles (256, 512, 1024, 2048, etc.)
- ⏱️ Game timer to track your speed
- 🏆 Best score tracking across sessions
- 📱 Responsive design that works on desktop and mobile
- 🎨 Modern UI with clean, minimalist design
- ⌨️ Keyboard (arrow keys, WASD) and swipe controls
- 🚀 Highly optimized performance

## Performance Optimizations

This implementation includes several performance optimizations:

- Component memoization to prevent unnecessary re-renders
- Efficient state management with useReducer and useMemo
- Optimized game logic with cached calculations
- Smooth animations using Framer Motion
- Responsive layout that adapts to different screen sizes

## Deployment

This game is deployed on Vercel. You can:

1. Play it live at: [2048-prettier.vercel.app](https://2048-prettier.vercel.app)
2. Deploy your own version:
   - Fork this repository
   - Import it on [Vercel](https://vercel.com)
   - Deploy with default settings
   - No environment variables needed

Your game will be instantly deployed and available at `https://your-repo-name.vercel.app`

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tenneseecox/2048-prettier.git
cd 2048-prettier
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## How to Play

- Use your **arrow keys** or **WASD** keys to move the tiles.
- On mobile, **swipe** in the direction you want to move the tiles.
- When two tiles with the same number touch, they **merge into one** with the sum of their values.
- The goal is to create a tile with the value **2048**.
- After reaching 2048, you can continue playing to achieve even higher scores.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

## Project Structure

```
2048-prettier/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router
│   ├── components/     # React components
│   │   ├── game/       # Game-specific components
│   │   └── ui/         # UI components (shadcn)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and game logic
│   └── types/          # TypeScript type definitions
├── .gitignore          # Git ignore file
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Original 2048 game by [Gabriele Cirulli](https://github.com/gabrielecirulli/2048)
- Inspired by various 2048 implementations and modern web development practices
