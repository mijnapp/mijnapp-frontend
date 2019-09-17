using System.Net.Http;
using System.Threading.Tasks;

namespace MijnApp_Backend.HttpClients
{
    public interface IDigidClient
    {
        Task<HttpResponseMessage> GetAsync(string url);
    }

    public class DigidClient : IDigidClient
    {
        private readonly HttpClient _client;

        public DigidClient(HttpClient client)
        {
            _client = client;
        }

        public async Task<HttpResponseMessage> GetAsync(string url)
        {
            return await _client.GetAsync(url);
        }
    }
}
