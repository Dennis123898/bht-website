import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useClerkUser } from '../hook/useClerkUser';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useClerkUser();

  return (
    <div className="flex flex-col min-h-screen bg-blue-900 text-white">
      <header className="bg-blue-900 py-4 px-6 flex justify-between items-center relative">
        <Link to="/" 
              className="flex items-center space-x-4 ml-4 sm:ml-8 lg:ml-20">
          <img src="/Images/BCU_LOGO.png" 
               alt="BCU Logo" 
               className="h-10 w-10" />
          <span className="text-2xl font-bold text-white">BCU</span>
        </Link>
        <button 
          className="sm:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰  
        </button>
        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row absolute sm:relative top-full 
                         left-0 right-0 sm:top-auto sm:left-auto sm:right-auto bg-white sm:bg-transparent`}>
          <Link to="/" className="text-blue-900 sm:text-white py-2 px-4 block sm:inline-block hover:bg-blue-100 
                                  sm:hover:bg-transparent sm:hover:text-blue-300 font-bold">Trang chủ</Link>
          <Link to="/gioi-thieu" className="text-blue-900 sm:text-white py-2 px-4 block sm:inline-block 
                                            hover:bg-blue-100 sm:hover:bg-transparent sm:hover:text-blue-300 
                                            font-bold">Giới thiệu</Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto text-center py-2 px-4 bg-yellow-400 
                                 text-blue-900 hover:bg-yellow-300 mt-2 sm:mt-0 
                                 font-bold rounded-lg">
                Đăng nhập
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </header>

      <main className="bg-blue-900 text-white w-full pt-24 pb-16">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 lg:pr-4 lg:pl-20">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Ban học tập</h1>
            <h2 className="text-4xl sm:text-5xl mb-6">Đoàn Khoa Khoa Học Máy Tính BCU</h2>
            <p className="text-lg sm:text-xl mb-6">
              Bạn đang tìm nơi để học tập, tìm kiếm tài liệu và giải trí, 
              Khoa Khoa Học Máy Tính BCU là điểm khởi đầu tuyệt vời.
            </p>
            {!isLoading && (
              <>
                <SignedIn>
                  <button
                    className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-300 font-bold"
                    onClick={() => navigate('/upload')}
                  >
                    Khám phá {user?.firstName}
                  </button>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-yellow-400 text-black 
                                       py-2 px-4 rounded hover:bg-yellow-300 
                                       font-bold">
                     Khám phá
                    </button>
                  </SignInButton>
                </SignedOut>
              </>
            )}
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:ml-6">
            <img 
              src="/Images/image_for_hp.png" 
              alt="Character" 
              className="h-65 w-65 sm:h-80 sm:w-80 object-cover" 
            />
          </div>
        </div>
      </main>

      <footer className="bg-blue-950 text-white w-full py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="w-full lg:w-5/12 mb-8 lg:mb-0 lg:pr-8">
              <p className="text-sm font-sans lg:pl-16 lg:pr-4">
                Chào mừng các bạn sinh viên đến với Ban Học Tập của khoa Khoa Học Máy Tính. 
                Tại đây, các bạn có cơ hội chia sẻ kiến thức, học tập hiệu quả và thư giãn sau những giờ học căng thẳng. 
                Chúng tôi hy vọng môi trường này sẽ giúp bạn phát triển và tận hưởng quá trình học tập của mình.
              </p>
            </div>

            <div className="w-full lg:w-5/12 flex flex-col sm:flex-row justify-center lg:justify-start
                            space-y-8 sm:space-y-0 sm:space-x-8 lg:space-x-16 lg:pl-8">
              <div className="flex flex-col">
                <p className="text-lg font-normal mb-4">Truy cập</p>
                <a href="#home" className="text-white text-base font-normal mb-2 hover:text-blue-300 hover:underline">
                  Trang chủ
                </a>
                <a href="#about" className="text-white text-base font-normal mb-2 hover:text-blue-300 hover:underline">
                  Liên hệ
                </a>
              </div>

              <div className="flex flex-col">
                <p className="text-lg font-normal mb-4">Liên hệ</p>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" 
                   className="text-white text-base font-normal mb-2 hover:text-blue-300 hover:underline">
                  Facebook
                </a>
                <a href="mailto:contact@example.com" 
                   className="text-white text-base font-normal mb-2 hover:text-blue-300 hover:underline">
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;