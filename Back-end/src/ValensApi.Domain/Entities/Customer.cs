using System;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Customer : BaseEntity
{
    public Guid? UserId { get; set; } // Nullable if they check out as a guest
    public User? User { get; set; }
    
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
}
