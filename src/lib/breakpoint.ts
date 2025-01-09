import { useMediaQuery } from 'react-responsive';

const useBreakpoints = () => {
    const isSmAndDown = useMediaQuery({ query: '(max-width: 640px)' }); // sm
    const isMdAndDown = useMediaQuery({ query: '(max-width: 768px)' }); // md
    const isLgAndDown = useMediaQuery({ query: '(max-width: 1024px)' }); // lg
    const isXlAndDown = useMediaQuery({ query: '(max-width: 1280px)' }); // xl

    const isSmAndUp = useMediaQuery({ query: '(min-width: 640px)' }); // sm
    const isMdAndUp = useMediaQuery({ query: '(min-width: 768px)' }); // md
    const isLgAndUp = useMediaQuery({ query: '(min-width: 1024px)' }); // lg
    const isXlAndUp = useMediaQuery({ query: '(min-width: 1280px)' }); // xl

    return {
        isSmAndDown,
        isMdAndDown,
        isLgAndDown,
        isXlAndDown,
        isSmAndUp,
        isMdAndUp,
        isLgAndUp,
        isXlAndUp,
    };
};

export default useBreakpoints;
