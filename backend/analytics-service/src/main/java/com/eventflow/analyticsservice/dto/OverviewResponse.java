package com.eventflow.analyticsservice.dto;

public class OverviewResponse {
  private String totalRevenue;
  private String totalAttendees;
  private String eventsHosted;
  private String avgTicketPrice;

  public OverviewResponse(String totalRevenue, String totalAttendees, String eventsHosted, String avgTicketPrice) {
    this.totalRevenue = totalRevenue;
    this.totalAttendees = totalAttendees;
    this.eventsHosted = eventsHosted;
    this.avgTicketPrice = avgTicketPrice;
  }

  public String getTotalRevenue() {
    return totalRevenue;
  }

  public String getTotalAttendees() {
    return totalAttendees;
  }

  public String getEventsHosted() {
    return eventsHosted;
  }

  public String getAvgTicketPrice() {
    return avgTicketPrice;
  }
}

