package com.hcmute.tlcn.entities;

public enum ThirdPaymentStatusEnum {
    PENDING, SUCCESS, FAILED;

    public static ThirdPaymentStatusEnum fromString(String status) {
        for (ThirdPaymentStatusEnum s : ThirdPaymentStatusEnum.values()) {
            if (s.name().equalsIgnoreCase(status)) {
                return s;
            }
        }
        return null;
    }
}
