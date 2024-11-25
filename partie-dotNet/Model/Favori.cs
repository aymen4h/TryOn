using LouageApi.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TryOnApi.Model
{
    public class Favori
    {
        public int Id { get; set; }
        [Required]
        public string? Image { get; set; }
        [Required]
        [ForeignKey("AppUser")]
        public string? UserId { get; set; }
        public virtual AppUser? User { get; set; }
    }
}
