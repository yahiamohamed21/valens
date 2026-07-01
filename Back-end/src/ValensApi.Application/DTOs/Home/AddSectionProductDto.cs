using System;

namespace ValensApi.Application.DTOs.Home;

public class AddSectionProductDto
{
    public Guid ProductId { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}
