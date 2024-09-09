import React, { useState, useRef, useEffect } from 'react';
import './Grid.css';

interface GridProps {
  weeklyData: {
    letter: string;
    number: number;
    color: string;
    shape: string;
  };
}

const Grid: React.FC<GridProps> = ({ weeklyData }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [letterImages, setLetterImages] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    const fetchLetterImages = async () => {
      const letter = weeklyData.letter.toUpperCase();
      const baseUrl = `/assets/letters/images/${letter}/`;
      const images: string[] = [];

      console.log(`Fetching images for letter: ${letter}`);

      const vowels = ['A', 'E', 'I', 'O', 'U'];
      const imagesToFetch = vowels.includes(letter) ? 2 : 1;

      for (let i = 1; i <= imagesToFetch; i++) {
        const imgUrl = `${baseUrl}${i}.png`;
        try {
          console.log(`Attempting to fetch: ${imgUrl}`);
          const response = await fetch(imgUrl);
          if (response.ok) {
            console.log(`Successfully fetched: ${imgUrl}`);
            images.push(imgUrl);
          } else {
            console.log(`Image not found: ${imgUrl}`);
          }
        } catch (error) {
          console.error(`Error fetching image ${imgUrl}:`, error);
        }
      }

      console.log(`Total images found: ${images.length}`);
      console.log(`Image URLs:`, images);
      setLetterImages(images);
    };

    fetchLetterImages();
  }, [weeklyData.letter]);

  useEffect(() => {
    if (expandedItem === 'Letter' && audioRef.current) {
      audioRef.current.play()
        .then(() => console.log('Audio playback started automatically'))
        .catch(error => console.error('Error playing audio automatically:', error));
    }
  }, [expandedItem]);

  const handleItemClick = (item: string) => {
    setExpandedItem(item);
  };

  const handleBackClick = () => {
    setExpandedItem(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getImagePath = (item: string, content: string | number): string => {
    switch (item) {
      case 'Number':
        return `/assets/numbers/${content}.png`;
      case 'Color':
        return `/assets/colors/${content}.png`;
      case 'Shape':
        return `/assets/shapes/${content}.png`;
      default:
        return '';
    }
  };

  const renderLetterImages = (isExpanded: boolean) => {
    console.log(`Rendering letter images. Total images: ${letterImages.length}`);
    return (
      <div className={`letter-images ${isExpanded ? 'expanded' : ''}`}>
        {letterImages.map((img, index) => {
          console.log(`Rendering image ${index + 1}: ${img}`);
          return (
            <div key={index} className="image-container letter-container">
              <img src={img} alt={`Letter of the week ${index + 1}`} />
            </div>
          );
        })}
      </div>
    );
  };

  const renderGridItem = (item: string, content: string | number) => {
    const imagePath = getImagePath(item, content);

    if (expandedItem === item) {
      return (
        <div className="expanded-item">
          <button className="back-button" onClick={handleBackClick}>
            ←
          </button>
          {item === 'Letter' ? renderLetterImages(true) : (
            <img src={imagePath} alt={`${item} of the week`} />
          )}
          {item === 'Letter' && (
            <audio 
              ref={audioRef} 
              src={`/assets/letters/music/${content}.mp3`}
              onLoadedMetadata={() => console.log('Audio loaded:', audioRef.current?.src)}
              onError={(e) => console.error('Audio error:', e)}
            />
          )}
        </div>
      );
    }
    return (
      <div className="grid-item">
        <h3>{item} of the Week</h3>
        {item === 'Letter' ? (
          <div className="letter-wrapper" onClick={() => handleItemClick(item)}>
            {renderLetterImages(false)}
          </div>
        ) : (
          <div className="image-container" onClick={() => handleItemClick(item)}>
            <img src={imagePath} alt={`${item} of the week`} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid-container">
      <div className="grid">
        {renderGridItem('Letter', weeklyData.letter)}
        {renderGridItem('Number', weeklyData.number)}
        {renderGridItem('Color', weeklyData.color)}
        {renderGridItem('Shape', weeklyData.shape)}
      </div>
    </div>
  );
};

export default Grid;