import React, { useContext } from "react";
import Slider from "react-slick";
import { BoardContext } from "../context/BoardContext";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const BoardsCarousel = () => {
  const { boards, setActiveBoardId } = useContext(BoardContext);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // сколько досок видно сразу
    slidesToScroll: 1,
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-black">Мои доски</h2>
      <Slider {...settings}>
        {boards.map((board) => (
          <div key={board.id} className="px-4">
            {/* Обёртка доски */}
            <div
              className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl transition overflow-hidden"
              onClick={() => setActiveBoardId(board.id)} // кликнуть — перейти в доску
            >
              <div className="relative">
                {/* Слайдер картинок внутри доски */}
                <BoardImagesSlider images={board.images} />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
                  {board.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BoardsCarousel;
