using backend.Context;
using backend.Models;
using backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public ProductController(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("Products")]
        public async Task<IActionResult> getProducts()
        {
            var products = await dbContext.Products.ToListAsync();
            var productDtos = products.Select(product => new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                CategoryId = product.CategoryId
            }).ToList();
            

            return Ok(productDtos);
        }

        [HttpGet]
        [Route("ProductBy/{id:int}")]
        public async Task<IActionResult> getOneProduct(int id)
        {
            var product = await dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);

            if(product == null)
            {
                return NotFound(new { message = $"The product does not exist." });
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                CategoryId = product.CategoryId
            };

            return Ok(productDto);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> createProduct([FromBody] ProductDto productDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                Quantity = productDto.Quantity,
                Inventory = productDto.Inventory,
                CategoryId = productDto.CategoryId
            };

            dbContext.Products.Add(product);
            await dbContext.SaveChangesAsync();

            var result = new
            {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.Quantity,
                product.Inventory,
                product.CategoryId
            };

            return Ok(result);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> updateProduct([FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await dbContext.Products.FindAsync(productDto.Id);
            
            if(product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.Quantity = productDto.Quantity;
            product.CategoryId = productDto.CategoryId;
            product.Inventory = productDto.Inventory;

            await dbContext.SaveChangesAsync();

            var result = new
            {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.Quantity,
                product.Inventory,
                product.CategoryId
            };

            return Ok(result);
        }


        [HttpDelete]
        [Route("Remove/{id:int}")]
        public async Task<IActionResult> deleteProduct(int id)
        {
            var product = await dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = $"The product does not exist." });
            }

            dbContext.Products.Remove(product);
            await dbContext.SaveChangesAsync();
            return Ok(new {message = "Product successfully removed"});
        }
    }
}
