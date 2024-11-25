using LouageApi.AuthRepo;
using LouageApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LouageApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController (Authenti auth) : ControllerBase
    {
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Register(RegisterDTO user)
        {
            var response = await auth.CreateAccount(user);
            return Ok(response);
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            var response = await auth.LoginAccount(loginDTO);
            return Ok(response);
        }
        [HttpGet, Authorize]
        [Route("[action]")]
        public  ActionResult CheckToken()
        {
            var name = User?.Identity?.Name;
            return Ok(name);
        }
        [HttpGet]
        [Route("[action]")]
        public string Hello()
        {
            return "hello";
        }
    }
}
