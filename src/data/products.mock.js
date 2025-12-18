const products = [
    {
        id: 'jx-25ZP',
        name: 'jx-25ZP',

        // 用于 Products 页分类
        category: "utility-trolley",

        // 业务字段
        moq: 2000,
        priceRange: 'USD 2.6',

        variants: [
            {
              key: "black",
              label: "Black",
              images: [
                "/images/JX_25ZP/black/1.jpg",
                "/images/JX_25ZP/black/2.jpg",
                "/images/JX_25ZP/black/3.jpg",
                "/images/JX_25ZP/black/4.jpg",
              ],
            },
        ],

        specs: {
            max_Size: "36.5 x 31 x 87 cm",
            folded_Size: "51 x 31 x 9.5 cm",
          
            carton_Size: "52 x 31.5 x 55.5 cm",
            pcsPer_Carton: 12,
          
            net_Weight: "20 kg",
            gross_Weight: "21.5 kg",
          
            wheel_Size: "90 mm",
          
            container_Load: "20GP: 3696 pcs / 40GP: 7656 pcs / 40HQ: 8976 pcs",
          }
        
    },

    {
        id: 'jx-C3D',
        name: 'jx-C3D',

        // 用于 Products 页分类
        category: "shopping-trolley",

        // 业务字段
        moq: 1000,
        priceRange: 'USD 6.3',

        variants: [
            {
              key: "blue",
              label: "Blue",
              images: [
                "/images/JX_C3D/blue/1.jpg",
                "/images/JX_C3D/blue/2.jpg",
                "/images/JX_C3D/blue/3.jpg",
                "/images/JX_C3D/blue/4.jpg",
              ],
            },
            {
                key: "reddish_brown",
                label: "Reddish Brown",
                images: [
                    "/images/JX_C3D/reddish_brown/1.jpg",
                    "/images/JX_C3D/reddish_brown/2.jpg",
                ],
              },
        ],

        specs: {
            
          },
        
    },
    {
      id: 'jx-A2D',
      name: 'JX-A2D',
    
      // 用于 Products 页分类
      category: "shopping-trolley",
    
      // 业务字段
      moq: 1000,
      priceRange: 'USD 3.2', // 如果你后面有精确报价可替换
    
      variants: [
        {
          key: "rose_pink",
          label: "Rose Pink",
          images: [
            "/images/JX_A2D/rose_pink/1.jpg",
            "/images/JX_A2D/rose_pink/2.jpg",
            "/images/JX_A2D/rose_pink/3.jpg",
            "/images/JX_A2D/rose_pink/4.jpg"
          ],
        },
        {
          key: "burgundy_floral",
          label: "Burgundy Floral",
          images: [
            "/images/JX_A2D/burgundy_floral/1.jpg",
            "/images/JX_A2D/burgundy_floral/2.jpg",
            "/images/JX_A2D/burgundy_floral/3.jpg",
            "/images/JX_A2D/burgundy_floral/4.jpg"
          ],
        },
        {
          key: "sky_blue_floral",
          label: "Sky Blue Floral",
          images: [
            "/images/JX_A2D/sky_blue_floral/1.jpg",
            "/images/JX_A2D/sky_blue_floral/2.jpg",
            "/images/JX_A2D/sky_blue_floral/3.jpg",
            "/images/JX_A2D/sky_blue_floral/4.jpg",
          ],
        },
        {
          key: "coffee_polka_dot",
          label: "Coffee Polka Dot",
          images: [
            "/images/JX_A2D/coffee_polka_dot/1.jpg",
            "/images/JX_A2D/coffee_polka_dot/2.jpg",
            "/images/JX_A2D/coffee_polka_dot/3.jpg",
            "/images/JX_A2D/coffee_polka_dot/4.jpg",
          ],
        },
      ],
    
      specs: {
        productSize: "34 x 29 x 96 cm",
        cartonSize: "92 x 36 x 32 cm / 10 pcs",
        netWeight: "16 kg",
        grossWeight: "17 kg",
        wheelSize: "160 mm",
        containerCapacity: "20GP: 2500 / 40GP: 5100 / 40HQ: 6100",
      },
    },



  ];
  
  export default products;