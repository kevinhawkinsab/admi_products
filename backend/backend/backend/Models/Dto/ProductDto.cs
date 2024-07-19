﻿using System.ComponentModel.DataAnnotations;

namespace backend.Models.Dto
{
    public class ProductDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El campo Name es obligatorio.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "El campo Category es obligatorio.")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "El campo Price es obligatorio.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El Precio debe ser mayor que 0.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "La Cantidad es obligatoria.")]
        [Range(1, int.MaxValue, ErrorMessage = "La Cantidad debe ser mayor 0.")]
        public int Quantity { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public string Inventory
        {
            get
            {
                if (Quantity == 0)
                    return "Agotado";
                if (Quantity < 5)
                    return "Limitado";
                return "En Stock";
            }
        }
    }
}
