import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

function MypageLayout() {
    return (
        <div className="flex flex-col w-full h-screen bg-background">
            <Header />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default MypageLayout;
