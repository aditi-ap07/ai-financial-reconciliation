from datetime import datetime


def is_next_month(tx_date, settle_date):
    tx = datetime.fromisoformat(tx_date)
    st = datetime.fromisoformat(settle_date)
    month_end = datetime(tx.year, tx.month, 1)
    if tx.month == 12:
        month_end = month_end.replace(year=tx.year + 1, month=1)
    else:
        month_end = month_end.replace(month=tx.month + 1)
    month_end = month_end - __import__('datetime').timedelta(days=1)
    return st.date() > month_end.date()
