const { isEmpty } = require("lodash");

exports.filterRangeSetHeader = (res, total, start, end) => {
    if (end > total) {
        end = total;
    }
    console.log(total, start, end);
    res.setHeader("Content-Range", `items ${start}-${end}/${total}`);
};

exports.getWhereClause = (query) => {
    const { sort, range, filter } = query;
    let whereClause;

    if (!isEmpty(filter)) {
        let queryParams;
        try {
            queryParams = JSON.parse(filter);
        } catch (e) {
            console.log(e);
        }

        whereClause = Object.keys(queryParams).reduce((where, key) => {
            if (key === "id") {
                where["_id"] = { $in: queryParams[key] };
            } else if (key === "owner" || key == "account" || key == "instrument") {
                where[key] = queryParams[key];
            } else if (key === "due") {
                where["due"] = { ...where["due"], $lte: queryParams[key] }
            } else if (key === "lte") {
                where["createdAt"] = { ...where["createdAt"], $lte: queryParams[key] }
            } else if (key === "gte") {
                where["createdAt"] = { ...where["createdAt"], $gte: queryParams[key] }
            } else {
                where[key] = { $regex: queryParams[key], $options: 'i' };
            }
            return where;
        }, {});
    }

    let start = 0;
    let end = 4;

    try {
        if (!isEmpty(range)) {
            start = JSON.parse(range)[0];
            end = JSON.parse(range)[1];
        }
    } catch { }

    if (start < 0) {
        start = 0;
    }
    if (start > end) {
        start = end;
    }
    condition = {};
    condition.start = start;
    condition.end = end;
    if (!isEmpty(whereClause)) {
        condition.where = whereClause;
    }

    if (!isEmpty(sort)) {
        var order = {};

        condition.order = [JSON.parse(sort)];
        if (!isEmpty(condition.order) && !isEmpty(condition.order[0])) {
            order[condition.order[0][0]] = condition.order[0][1] == "ASC" ? 1 : -1;
        }
        condition.order = order;
    }

    if (!isEmpty(range)) {
        condition.limit = end - start + 1;
        condition.offset = start;
    }

    return condition;
};
