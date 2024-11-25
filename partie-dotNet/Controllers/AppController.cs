using LouageApi.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TryOnApi.Model;

namespace TryOnApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AppController(AppDbContext dbcontext) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetUserImage(string id)
        {
            try
            {
                // Récupérer l'utilisateur de la base de données de manière asynchrone
                var user = await dbcontext.Users.FindAsync(id);

                // Vérifier si l'utilisateur existe
                if (user != null)
                {
                    // Vérifier si l'image de l'utilisateur n'est pas null
                    if (!string.IsNullOrEmpty(user.Image))
                    {
                        // Retourner l'image de l'utilisateur au format JSON
                        return Ok(new { image = user.Image });
                    }
                    else
                    {
                        return NotFound(new { message = "L'image de l'utilisateur est vide ou null." });
                    }
                }
                else
                {
                    return NotFound(new { message = "Utilisateur non trouvé." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Une erreur s'est produite: {ex.Message}" });
            }
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> SaveFavoris(Favori favori)
        {
            favori.Id = 0;
            dbcontext.Favoris?.Add(favori);
            await dbcontext.SaveChangesAsync();
            return Ok(favori);
        }
        [Authorize]
        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetFavoris(string id)
        {
            var favoris = await dbcontext.Favoris
                                .Where(f => f.UserId == id)
                                .ToListAsync();

            if (favoris != null && favoris.Any())
            {
                return Ok(favoris);
            }
            else
            {
                return NotFound(); // Renvoyer une réponse 404 si aucun enregistrement n'est trouvé
            }
        }
        [HttpDelete]
        [Route("[action]/{id}")]
        public async Task<IActionResult> RemoveFavoris(int id)
        {
            var favoris = await dbcontext.Favoris.FindAsync(id);
            if (favoris != null)
            {
                dbcontext.Favoris.Remove(favoris);
                await dbcontext.SaveChangesAsync();
            }
            
            return Ok(favoris);
        }
    }
}
