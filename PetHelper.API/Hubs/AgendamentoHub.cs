using Microsoft.AspNetCore.SignalR;

namespace PetHelper.API.Hubs
{
    public class AgendamentoHub : Hub
    {
        public async Task EnviarNotificacao(string mensagem)
        {
            await Clients.All.SendAsync("ReceberNotificacao", mensagem);
        }
    }
}
