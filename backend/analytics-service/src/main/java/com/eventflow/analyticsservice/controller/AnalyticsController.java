package com.eventflow.analyticsservice.controller;

import com.eventflow.analyticsservice.dto.OverviewResponse;
import com.eventflow.analyticsservice.dto.RevenuePoint;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
  @GetMapping("/overview")
  public OverviewResponse overview() {
    return new OverviewResponse("$425,800", "8,245", "124", "$185");
  }

  @GetMapping("/revenue")
  public List<RevenuePoint> revenue() {
    return List.of(
      new RevenuePoint("Jan", 4000),
      new RevenuePoint("Feb", 3000),
      new RevenuePoint("Mar", 2000),
      new RevenuePoint("Apr", 2780),
      new RevenuePoint("May", 1890),
      new RevenuePoint("Jun", 2390),
      new RevenuePoint("Jul", 3490)
    );
  }
}

