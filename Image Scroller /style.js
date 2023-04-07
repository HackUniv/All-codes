const data = [
    {
        imageUrl: "https://image.lexica.art/full_jpg/1a173e4b-b60a-49c2-87c8-6ce6dfa38415",
       itemName: "Graphic flyer, with a 2d vectorial illustration of a happy woman",
    },
    {
        imageUrl: "https://image.lexica.art/full_jpg/b98def10-fee5-4230-a88b-da6a47a6e3c5",
        itemName: "Astronaut walking on the surface of the moon",
    },
    {
        imageUrl: "https://image.lexica.art/full_jpg/3f0747bf-0ada-43d5-9339-7e702f04f7e5",
        itemName: "Portrait of wall - e, sci - fi, tech wear, blue and yellow glowing lights",
    },
    {
        imageUrl: "https://image.lexica.art/full_jpg/9174dea9-0ead-41f0-a100-76adf694a515",
        itemName: "Modern, illustrations, epic, fantasy, intricate, hyper detailed",
    },
    {
        imageUrl: "https://image.lexica.art/full_jpg/84506783-4573-45a7-8132-56d3f1a3c742",
        itemName: "A cute adorable baby phoenix made of crystal ball",
    },
    {
        imageUrl: "https://image.lexica.art/full_jpg/ea55301f-a931-4df1-ba5d-c02747732667",
        itemName: "Astronaut walking on the surface of the moon with earth",
    },
    {
        imageUrl: "https://image.lexica.art/full_jpg/f0cdfc87-d72d-4a35-ae62-52ca971746d3",
        itemName: "All gray sphynx with blue eyes with classical roses elements emanating from center of face",
    },
]

// Constants variables - DOM elements
const prodItems = document.querySelector('.prod-items');
const prevBtn = document.querySelector('.left-btn');
const nextBtn = document.querySelector('.right-btn');
// Declare slideTimer variable globally for better control
let slideTimer;

function createProductElement(prodDetails) {
  const { imageUrl, itemName } = prodDetails;
  const productItem = document.createElement('div');
  productItem.classList.add('prod-item');
  productItem.innerHTML = `
        <div class="img-cont">
          <img src="${imageUrl}" />
        </div>
        <h3 class="item-name">${itemName}</h3>
        
        `;
  return productItem;
}

function displayProducts(items = data) {
  prodItems.innerHTML = '';
  items.forEach(item => {
    const productItem = createProductElement(item);
    prodItems.appendChild(productItem);
  });
}

displayProducts();

// Function to handle slide animation
function handleSlide(direction) {
  // Clear any existing slide timer
  clearInterval(window.slideTimer);

  // Set the direction of slide based on input
  const increment = direction === 'next' ? 5 : -5;

  // Start slide animation
  window.slideTimer = setInterval(() => {
    // Update scrollLeft based on direction
    prodItems.scrollLeft += increment;
    if (prodItems.scrollLeft % 100 === 0) {
      // Use window.slideTimer to clear the interval
      clearInterval(window.slideTimer);
    }
  }, 15);
}

// Previous button scroll event (Scrolling to Left)
prevBtn.addEventListener('click', () => {
  handleSlide('prev'); // Call handleSlide with 'prev' direction
});

// Next button scroll event (Scrolling to Right)
nextBtn.addEventListener('click', () => {
  handleSlide('next'); // Call handleSlide with 'next' direction
});

// Autoplay function
function autoplay() {
  if (
    prodItems.scrollLeft >=
    prodItems.scrollWidth - prodItems.clientWidth - 1
  ) {
    prodItems.scrollLeft = 0;
  } else {
    prodItems.scrollLeft += 1;
  }
}

let play = setInterval(autoplay, 15);

// Pause slide when hover
prodItems.addEventListener('mouseover', () => {
  clearInterval(play);
});

// Resume slide after pause
prodItems.addEventListener('mouseout', () => {
  play = setInterval(autoplay, 15);
});